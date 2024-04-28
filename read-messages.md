solution 1 (used):

using message status in message model, in this case i use 1 as delivered, 2 as read
then add new field in conversation which is unread that show how many unread bubble based on message status of each message
when getting conversation, all message looped and incremented when message status is 1

and when the user clicked the conversation/chatroom in client, put request to update message status


