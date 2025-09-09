import mongoose from "mongoose"

const CompanySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, index: true },
    website: { type: String },
    logo: { type: String },
    description: { type: String },
    // HR/recruiter who owns this company profile
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", index: true },
  },
  { timestamps: true }
)

export default mongoose.model("Company", CompanySchema)
