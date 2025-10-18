import mongoose, { Schema } from "mongoose"

const taskSchema = new Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true
        },
        description: {
            type: String,
            required: true,
            trim: true
        },
        status: {
            type: String,
            enum: ["todo", "inprogress", "done"],
            default: "todo"
        },
        projectId: {
            type: Schema.Types.ObjectId,
            ref: "Project",
            required: true
        },
        createdBy: {
            type: Schema.Types.ObjectId,
            ref: "User"
        },
        position: {
            type: Number,
            default: 0
        }
    },
    { timestamps: true }
)

export const Task = mongoose.model("Task", taskSchema)