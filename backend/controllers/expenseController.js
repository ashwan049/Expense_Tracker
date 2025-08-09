const xlxs = require('xlsx');
const Expense = require('../models/Expense');

// add expense source
exports.addExpense =  async (req, res) => {
    const userId = req.user._id;
    try{
        const { icon, category, amount, date } = req.body;
        if (!category || !amount || !date) {
            return res.status(400).json({ message: "Please fill all fields" });
        }
        const newExpense = new Expense({
            userId,
            icon,
            category,
            amount,
            date: new Date(date),
        });
        await newExpense.save();
        res.status(200).json(newExpense);

    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "server error in expense" });
    }
};
// get all Expense source
exports.getAllExpense =  async (req, res) => {
    const userId = req.user._id;
    try {
        const expense = await Expense.find({ userId }).sort({ date: -1 });
        res.json(expense);
    } catch (error) {
        res.status(500).json({ message: "server error in getting Expense" });
    }
};
// delete income source
exports.deleteExpense=  async (req, res) => {
    const userId = req.user._id;
    try {
        await Expense.findOneAndDelete({ _id: req.params.id });
        res.status(200).json({ message: "Income deleted successfully" });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "server error in deleting Expense" });
    }
};
// download income source in excel format
exports.downloadExpenseExcel =  async (req, res) => {
    const userId = req.user.id;
    try {
        const expense = await Expense.find({userId}).sort({ date: -1 });
        //prepare data for excel
        const data = expense.map((item)=>({
            category: item.category,
            Amount: item.amount,
            Date: item.date,
        }));

        const wb = xlxs.utils.book_new();
        const ws = xlxs.utils.json_to_sheet(data);
        xlxs.utils.book_append_sheet(wb, ws, "Expense");
        xlxs.writeFile(wb, "Expense_detial.xlsx");
        res.download("Expense_detial.xlsx");
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "server error in downloading Expense" });
    }
};