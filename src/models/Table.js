import mongoose from 'mongoose';

const TableSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Por favor, proporciona el nombre del producto'],
    },
    description: {
        type: String,
        required: false,
    },
    status: {
        type: String,
        required: [true, 'Por favor, proporciona el precio del producto'],
    },
    alert: {
        type: String,
        required: false,
    },
    active: {
        type: Boolean,
        required: true,
        default: true,
    },
    visible: {
        type: Boolean,
        required: true,
        default: true,
    },
    createdBy: {
        type: mongoose.ObjectId,
        required: false,
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now,
    },
});

export default mongoose.models.tables || mongoose.model('tables', TableSchema);
