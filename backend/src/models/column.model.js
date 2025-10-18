import mongoose, { Schema } from "mongoose"

const columnSchema = new Schema(
    {
        columnName: {
            type: String,
            required: true,
            trim: true
        },
        projectId: {
            type: Schema.Types.ObjectId,
            ref: "Project",
            required: true
        },
        position: {
            type: Number,
            required: true
        }
    },
    { timestamps: true }
)

export const Column = mongoose.model("Column", columnSchema)