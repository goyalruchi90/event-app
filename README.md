# Heroku- Event Management application

Event Management Application with AngularJS and nodeJS, deployed in Heroku
 
App url : https://event-app-conference360.herokuapp.com

Git URL : https://git.heroku.com/event-app-conference360.git

This application demonstrates:

-> A demo application with demo data allowing user to view list of events and sessions and register to particular event/session.

-> Using AngularJS with $http in controller to access backend RESTful service.

-> Using nodeJS to access heroku postgres service.

-> A custom routing mechanism that allows a controller & template to be downloaded dynamically "on the fly" and provides a standard convention for controller and view names.

-> AngularJS filter to search events and display events based on its status.

-> Form validation using AngularJS.

-> Upon registration, user gets a success/failure message. On successfull registration, user recieves an email with registered event/session details. 

-> User can't register to sold out or closed events, but can view its basic details and descriptions. 


Functionalities under developement :-
-> Login and sign up functionality

-> Footer icons functionality : Help, Contact Us, About


Events, sessions and attendees are managed on Saleforce.

# Saleforce Application Name :-  Event Manager C360

-> Objects Created: Events, Sessions, Attendees, Event Associations.

  a) Events :- Salesforce user can add new events. Once an event is created user can add sessions or attendees to that event. Event is the parent object for child objects sessions and attendees.
  
  b) Sessions :- Salesforce user can create new session under an existing event.
  
  c) Attendees :- Saleforce user can create new attendee under an existing event or session (if event have session).
  
  d) Event Associations :- Event Association is a link between Event, Session and Attendee objects. Whenever a attendee is created under any event/session, an event association is triggered. Saleforce user can add existing attendee to multiple events/sessions by adding a new event association. 


-> Validations Rules added:-

a) Events :- 

    1) End date Validation: Event end date cannot exceed event start date.
    
    2) Registration Limit : Registration Limit should be more than or equal to 0.
    
    3) Remaining Seats: Remaining seats cannot be more than the event registration limit.
    
b) Sessions :-

    1) Start Date Validation: Session Start cannot exceed event start date and cannot be more than event end date.
    
    2) End Date Validation: Session end date/time must be after the session start date/time but cannot be after the event end date/time.
    
    3) Registration Limit : Registration Limit should be more than or equal to 0 and less than or equal to event registration limit.
    
    4) Remaining Seats: Remaining seats cannot be more than the session or event registration limit.
    
c) Attendees :-

    1) Can add attendee to only 'open' events.
    
    2) Select a sessions if available for this event.
    
    3) Can add attendee to only 'open' sessions.
    
    4) Cannot add multiple attendees with same email-id.
    
d) Event Associations :-

    1) Can add entry only if the event/session status is Open.


-> Triggers added:-

a) trigEventAssociationEntry : Added under Attendee object. Adds a new entry to event association object after inserting new attendee.

b) trigEventSessionUpdate : Added under Event Association object. Sends email notification to attendee after inserting new event association entry. Updates the number of remaining seats. Updates event/session status to "Sold Out" if remaining seats equals 0.

c) trigEventDuplicatePreventer : Added under Event Association object. Prevents duplicate event association entries. Display's error message if attendee tries to register for same event/session. 


-> Workflow rules added:-

a) UpdateEventStatus : Update event status to closed after event end date expires.

b) UpdateSessionStatus : Update session status to closed after event end date expires.
                
