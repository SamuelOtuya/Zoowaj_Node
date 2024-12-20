import mongoose from 'mongoose';

const favoriteSchema = new mongoose.Schema({
    profile: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Profile',
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
});

export default mongoose.model('Favorite', favoriteSchema);
  