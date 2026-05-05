import mongoose from "mongoose";
import { Schema, type Document } from "mongoose";

export interface IDoctorDetails extends Document {
    userId: mongoose.Types.ObjectId;
    specialization: string;
    availability: { 
        day: string;
        slots: [{
            startTime: string;
            endTime: string;
        }]
    };
    experience: number;
    consultationFee: Number,
    ratings: number;
    education: string;
}

const doctorDetailsSchema = new Schema<IDoctorDetails>({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    specialization: { type: String, },
    availability: {
        day: { type: String, },
        slots: [{
            startTime: { type: String },
            endTime: { type: String }
        }]
    },
    experience: { type: Number },
    consultationFee: { type: Number },
    ratings: { type: Number, default: 0 },
    education: { type: String }
}, { timestamps: true});

const DoctorDetailsModel = mongoose.model<IDoctorDetails>('DoctorDetails', doctorDetailsSchema);
export default DoctorDetailsModel;