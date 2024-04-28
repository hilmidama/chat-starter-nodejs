const router = require("express").Router();
const { User, Conversation, Message } = require("../../db/models");
const { Op, to } = require("sequelize");
const onlineUsers = require("../../onlineUsers");

// get all conversations for a user, include latest message text for preview, and all messages
// include other user model so we have info on username/profile pic (don't include current user info)
router.get("/", async (req, res, next) => {
  try {
    if (!req.user) {
      return res.sendStatus(401);
    }
    const userId = req.user.id;
    const conversations = await Conversation.findAll({
      where: {
        [Op.or]: {
          user1Id: userId,
          user2Id: userId,
        },
      },
      attributes: ["id"],
      order: [[Message, "createdAt", "ASC"]],
      include: [
        { model: Message, order: ["createdAt", "DESC"] },
        {
          model: User,
          as: "user1",
          where: {
            id: {
              [Op.not]: userId,
            },
          },
          attributes: ["id", "username", "photoUrl"],
          required: false,
        },
        {
          model: User,
          as: "user2",
          where: {
            id: {
              [Op.not]: userId,
            },
          },
          attributes: ["id", "username", "photoUrl"],
          required: false,
        },
      ],
    });

    for (let i = 0; i < conversations.length; i++) {
      const convo = conversations[i];
      const convoJSON = convo.toJSON();

      // set a property "otherUser" so that frontend will have easier access
      if (convoJSON.user1) {
        convoJSON.otherUser = convoJSON.user1;
        delete convoJSON.user1;
      } else if (convoJSON.user2) {
        convoJSON.otherUser = convoJSON.user2;
        delete convoJSON.user2;
      }

      // set property for online status of the other user
      if (onlineUsers.includes(convoJSON.otherUser.id)) {
        convoJSON.otherUser.online = true;
      } else {
        convoJSON.otherUser.online = false;
      }

      // set properties for notification count and latest message preview
      convoJSON.latestMessageText =
        convoJSON?.messages[convoJSON?.messages?.length - 1]?.text;

      // count unread message and read message
      convoJSON?.messages.map(async (message) => {
        let unread = convoJSON?.unread ?? 0;

        //get unread message from other user
        if (message.senderId != userId && message.messageStatus == 1) {
          unread++;
        }
        convoJSON.unread = unread;
      });

      conversations[i] = convoJSON;
    }
    res.json(conversations);
  } catch (error) {
    next(error);
  }
});

router.put("/", async (req, res, next) => {
  try {
    if (!req.user) {
      return res.sendStatus(401);
    }

    if(!req?.body?.conversationId){
      return res.sendStatus(400);
    }

    const conversationId = req?.body?.conversationId
    let userId = req.user.id
    let conversation = await Conversation.findOne({
      where: {
        id: conversationId
      },
      attributes: ["id"],
      order: [[Message, "createdAt", "ASC"]],
      include: [
        { model: Message, order: ["createdAt", "DESC"] },
      ]
    })

    // read message
    conversation?.messages?.map(async (message) => {
      if (message.senderId != userId && message.messageStatus == 1) {
        // let msg = await new Message(message)
        let msg = await Message.findOne({
          where: {
            id: message.id,
          },
        });
        msg.messageStatus = 2;
        await msg.save({ fields: ["messageStatus"] });
      }
    })

    res.json(conversation)
  } catch (err) {
    next(err);
  }
});

module.exports = router;
