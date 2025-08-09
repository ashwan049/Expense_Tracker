const xlxs = require('xlsx');
const Income = require('../models/Income');

// add income source
exports.addIncome =  async (req, res) => {
    const userId = req.user._id;
    try{
        const { icon, source, amount, date } = req.body;
        if (!source || !amount || !date) {
            return res.status(400).json({ message: "Please fill all fields" });
        }
        const newIncome = new Income({
            userId,
            icon,
            source,
            amount,
            date: new Date(date),
        });
        await newIncome.save();
        res.status(200).json(newIncome);

    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "server error in income" });
    }
};
// get all income source
exports.getAllIncome =  async (req, res) => {
    const userId = req.user._id;
    try {
        const income = await Income.find({ userId }).sort({ date: -1 });
        res.json(income);
    } catch (error) {
        res.status(500).json({ message: "server error in getting income" });
    }
};
// delete income source
exports.deleteIncome=  async (req, res) => {
    const userId = req.user._id;
    try {
        await Income.findOneAndDelete({ _id: req.params.id });
        res.status(200).json({ message: "Income deleted successfully" });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "server error in deleting income" });
    }
};
// download income source in excel format
exports.downloadIncomeExcel =  async (req, res) => {
    const userId = req.user.id;
    try {
        const income = await Income.find({userId}).sort({ date: -1 });
        //prepare data for excel
        const data = income.map((item)=>({
            Source: item.source,
            Amount: item.amount,
            Date: item.date,
        }));

        const wb = xlxs.utils.book_new();
        const ws = xlxs.utils.json_to_sheet(data);
        xlxs.utils.book_append_sheet(wb, ws, "Income");
        xlxs.writeFile(wb, "Income_detial.xlsx");
        res.download("Income_detial.xlsx");
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "server error in downloading income" });
    }
};