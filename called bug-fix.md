main bug : 
1. new message is not appear immediately 
caused by : 
- when listening to socket-io "new-message", data.sender is always return null, so it will never meet the condition sender != null
solving : 
- in Input.js -> handlingSubmit function, switch if else case in when theres conversation id it will return user
code before : 
 sender: conversationId ? null : user,
code after : 
 sender: conversationId ? user : null,

2. messages are shown in the wrong order when the page loads
caused by : 
- when getting conversation from GET /conversations it sorted by desc 
solving : 
- change the sorting method to asc
code before : 
- order: [[Message, "createdAt", "DESC"]],
code after: 
- order: [[Message, "createdAt", "ASC"]],

additional : 
- adjust latestMessageText, latestMessageText is collected from first index of messages array but when the sorting was changed to asc it need to be adjusted to last index of messages
code before : 
- convoJSON.latestMessageText = convoJSON.messages[0].text;
code after : 
- convoJSON.latestMessageText = convoJSON.messages[convoJSON.messages.length - 1].text;


 <!--  -->

bug found : 
1. sending message when user already have conversations
caused by : 
- saveMessage function inside postMessage function not returning value 
solving :
- change postMessage to async function and add await when calling saveMessage function



 