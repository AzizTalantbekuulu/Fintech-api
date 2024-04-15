const express = require('express')
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('./userSchema');
const Transaction = require('./transactionSchema');

const app = express();

mongoose.connect('mongodb+srv://user:user@cluster0.gwns3ha.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0');
mongoose.connection.on('error', console.error.bind(console, 'MongoDB connection error'));

app.use(express.json())

app.post('/register', async (req, res) => {
    try {
        const existingUser = await User.findOne({ username: req.body.username });
        if (existingUser) {
            return res.status(400).send('User already exists');
        }

        const hashedPassword = await bcrypt.hashSync(req.body.password, 6);
        const user = new User({
            username: req.body.username,
            password: hashedPassword
        });
        await user.save();
        res.status(201).send('User registered successfully');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error registering user');
    }
});

app.post('/login', async (req, res) => {
    const user = await User.findOne({ username: req.body.username });
    if (!user) return res.status(400).send('User not found');
    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) return res.status(400).send('Invalid password');

    const token = jwt.sign({ userId: user._id }, 'secretkey');
    res.status(200).send({ token });
});

function authenticateToken(req, res, next) {
    const token = req.headers.authorization.split(' ')[1]
    if (!token) return res.sendStatus(401);

    jwt.verify(token, 'secretkey', (err, userId) => {
        if (err) return res.sendStatus(403);
        req.userId = userId;
        next();
    });
}

app.post('/transactions', authenticateToken, async (req, res) => {
    try {
        const transaction = new Transaction({
            amount: req.body.amount,
            description: req.body.description,
        });
        await transaction.save();
        res.status(201).send('Transaction created successfully');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error creating transaction');
    }
});

app.get('/transactions', authenticateToken, async (req, res) => {
    try {
        const transactions = await Transaction.find();
        res.status(200).json(transactions);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching transactions');
    }
});

app.get('/transactions/:id', authenticateToken, async (req, res) => {
    try {
        const transaction = await Transaction.findOne({ _id: req.params.id });
        if (!transaction) return res.status(404).send('Transaction not found');
        res.status(200).send(transaction);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching transaction');
    }
});

app.put('/transactions/:id', authenticateToken, async (req, res) => {
    try {
        const transaction = await Transaction.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true });
        if (!transaction) return res.status(404).send('Transaction not found');
        res.status(200).send(transaction);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error updating transaction');
    }
});

app.delete('/transactions/:id', authenticateToken, async (req, res) => {
    try {
        const transaction = await Transaction.findOneAndDelete({ _id: req.params.id });
        if (!transaction) return res.status(404).send('Transaction not found');
        res.status(200).send('Transaction deleted successfully');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error deleting transaction');
    }
});

app.listen(5001, () => {
    console.log('Server is running on port 5001');
});
