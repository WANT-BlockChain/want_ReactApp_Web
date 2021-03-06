import React, { Component } from "react";
import { Grid } from "semantic-ui-react";
import { connect } from "react-redux";
import { toastr } from "react-redux-toastr";
import { withFirestore } from "react-redux-firebase";
import { compose } from "redux";
import EventDetailedHeader from "./AEventDetailedHeader";
import EventDetailedInfo from "./AEventDetailedInfo";
import EventDetailedSidebar from "./AEventDetailedSidebar";
import LoadingComponent from "../../../../app/layout/LoadingComponent";
import {
  objectToArray
} from "../../../../app/common/util/helpers";
import { goingToEvent, cancelGoingToEvent } from "../../../user/userActions";
import { addEventComment } from "../../eventActions";
import { openModal } from "../../../modals/modalActions";

const mapState = (state, ownProps) => {
  let event = {};

  if (state.firestore.ordered.events && state.firestore.ordered.events[0]) {
    event = state.firestore.ordered.events[0];
  }

  return {
    requesting: state.firestore.status.requesting,
    event,
    loading: state.async.loading,
    auth: state.firebase.auth,
  };
};

const actions = {
  goingToEvent,
  cancelGoingToEvent,
  addEventComment,
  openModal
};

class EventDetailedPage extends Component {

  state = {
    initialLoading: true
  }

  async componentDidMount() {
    const { firestore, match } = this.props;
    let event = await firestore.get(`events/${match.params.id}`);
    if (!event.exists) {
      toastr.error("Not Found", "This is not the event you are looking for");
      this.props.history.push("/error");
    }
    await firestore.setListener(`events/${match.params.id}`);
    this.setState({
      initialLoading: false
    })
  }

  async componentWillUnmount() {
    const { firestore, match } = this.props;
    await firestore.unsetListener(`events/${match.params.id}`);
  }

  render() {
    const {
      openModal,
      loading,
      event,
      auth,
      goingToEvent,
      cancelGoingToEvent,
      requesting,
      match
    } = this.props;
    const attendees =
      event && event.attendees && objectToArray(event.attendees).sort(function(a, b) {
        return a.joinDate - b.joinDate;
      });
    const isHost = event.hostUid === auth.uid;
    const isGoing = attendees && attendees.some(a => a.id === auth.uid);
    const authenticated = auth.isLoaded && !auth.isEmpty;
    const loadingEvent = requesting[`events/${match.params.id}`];

    if (loadingEvent || this.state.initialLoading) return <LoadingComponent inverted={true} />
    return (
      <Grid>
        <Grid.Column width={10}>
          <EventDetailedHeader
            loading={loading}
            event={event}
            isHost={isHost}
            isGoing={isGoing}
            goingToEvent={goingToEvent}
            cancelGoingToEvent={cancelGoingToEvent}
            authenticated={authenticated}
            openModal={openModal}
          />
          <EventDetailedInfo event={event} />
        </Grid.Column>
        <Grid.Column width={6}>
          <EventDetailedSidebar attendees={attendees} />
        </Grid.Column>
      </Grid>
    );
  }
}

export default compose(
  withFirestore,
  connect(
    mapState,
    actions
  ),
)(EventDetailedPage);
