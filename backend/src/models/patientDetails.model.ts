import mongoose from "mongoose";
import { Schema, type Document } from "mongoose";

export interface IPatientDetails extends Document {
    userId: mongoose.Types.ObjectId;
    age: number;
    gender: "male" | "female" | "other";
    bloodGroup: "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-" | "O+" | "O-";
    allergies: string[]; 
    chronicConditions: string[];
    medications: string[];
}

const PatientDetailsSchema = new Schema<IPatientDetails>({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    age: { type: Number, required: true },
    gender: { type: String, enum: ["male", "female", "other"], required: true },
    bloodGroup: { type: String, enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"], required: true },
    allergies: [{ type: String }],
    chronicConditions: [{ type: String }],
    medications: [{ type: String }]
}, { timestamps: true });

const PatientDetailsModel = mongoose.model<IPatientDetails>("PatientDetails", PatientDetailsSchema);
export default PatientDetailsModel;