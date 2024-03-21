const express = require("express");
const router = express.Router();
const UserModel = require("../models/User");
const TransectionModel = require("../models/Transaction");

router.post("/deposit", async (req, res) => {
  try {
    const newData = req.body;
    const { deposit, userId } = newData;
    const thisUser = await UserModel.findById(userId);
    const newDeposit = parseInt(deposit);
    thisUser.balance += newDeposit;
    await thisUser.save();
    res.json(thisUser);
    console.log("deposit success");
  } catch (err) {
    console.log(err);
  }
});

router.post("/withdrew", async (req, res) => {
  try {
    const newData = req.body;
    const { withdrew, userId } = newData;
    const thisUser = await UserModel.findById(userId);
    const newWithdrew = parseInt(withdrew);
    thisUser.balance -= newWithdrew;
    if (thisUser.balance < 0) {
      res.json({ error: "You Broke NOW !!" });
    } else {
      await thisUser.save();
      res.json(thisUser);
      console.log("withdrew success");
    }
  } catch (err) {
    console.log(err);
  }
});

router.post("/transfer", async (req, res) => {
  try {
    const newData = req.body;
    const { transferTo, transferAmount, userId } = newData;
    const thisUser = await UserModel.findById(userId);
    const targetUser = await UserModel.findOne({ email: transferTo });
    const newTransferAmount = parseInt(transferAmount);
    thisUser.balance -= newTransferAmount;
    targetUser.balance += newTransferAmount;
    if (thisUser.balance < 0) {
      res.json({ error: "You Broke NOW !!" });
    } else {
      await thisUser.save();
      await targetUser.save();
      res.json(thisUser);
      console.log("Transfer success");
    }
  } catch (err) {
    console.log(err);
  }
});

router.post("/token", async (req, res) => {
  const { userId } = req.body;
  const thisUser = await UserModel.findById(userId);
  res.json(thisUser);
});

router.post("/createtransaction", async (req, res) => {
  const { userId, transferTo, transferAmount } = req.body;
  const fromUser = await UserModel.findById(userId);
  const toUser = await UserModel.findOne({email: transferTo});

  const newTransaction = new TransectionModel({
    from: fromUser.email,
    to: toUser.email,
    amount: transferAmount,
  });
  newTransaction
    .save()
    .then(() => {
      console.log("Transections created");
    })
    .catch((err) => {
      console.error(err);
    });
});
router.post("/transaction", async (req, res) => {
  const { userEmail } = req.body;
  const UserTransection = await TransectionModel.find({ from: userEmail });
    const UserTransection2 = await TransectionModel.find({ to: userEmail });
    const UserTransection3 = UserTransection.concat(UserTransection2);
  res.json(UserTransection3);
})

module.exports = router;
