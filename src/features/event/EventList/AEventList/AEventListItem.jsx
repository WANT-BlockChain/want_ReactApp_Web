import React, { Component } from 'react';
import { Segment, Item, Icon, List, Button, Label } from 'semantic-ui-react';
import { Link } from 'react-router-dom'
import EventListAttendee from './AEventListAttendee'
import format from 'date-fns/format'
import { objectToArray } from '../../../../app/common/util/helpers'

class EventListItem extends Component {



  render() {
    function shoot() {
      alert("투자 금액을 받았습니다.");
    }

    const {event} = this.props
    return (
    <Segment.Group>
        <Segment>
          <Item.Group>
            <Item>
              <Item.Image size="tiny" circular src={event.hostPhotoURL} />
              <Item.Content>
                <Item.Header as={Link} to={`/event/${event.id}`}>{event.title}</Item.Header>
                <Item.Description>
                  대출자 명 <Link to={`/profile/${event.hostUid}`}>{event.hostedBy}</Link>
                </Item.Description>

                <Item.Description>
                신용 등급 <Link to={`/profile/${event.hostUid}`}>{event.Creditratingy}</Link>
                </Item.Description>
                <Label style={{top: '-40px'}} ribbon='right' color='blue' content='[대출, 투자 분배성공] 대출이 완료되어 대출자가 상환된 게시글'/>
              </Item.Content>

              {event.cancelled &&
                <Label style={{top: '-40px'}} ribbon='right' color='red' content='[관리자 검토 부적합, 개인적인 사정] 투자가 불가능한 게시글'/>}
            </Item>

          </Item.Group>
        </Segment>
        <Segment>
          <span>
            <Icon name="clock" /> {format(event.date.toDate(), 'dddd Do MMMM')} {format(event.date.toDate(), 'HH:mm')} 까지 모집 

          </span>
          </Segment>
          <Segment>
          <Icon name="money" /> {event.venue}
          <span>
            대출 금액 :
          {event.money} 원
           </span>
        </Segment>
        <Segment secondary>
          <List horizontal>
          {event.attendees && objectToArray(event.attendees).map((attendee) => (
            <EventListAttendee key={attendee.id} attendee={attendee}/>
          ))}

          </List>
        </Segment>
        <Segment clearing>
        <span>{event.description}</span>
          <Button onClick={shoot}color="blue" floated="right" content="투자수익 받기" />
        </Segment>
      </Segment.Group>
    );
  }
}

export default EventListItem;
