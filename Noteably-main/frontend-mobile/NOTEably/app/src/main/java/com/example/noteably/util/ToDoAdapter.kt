package com.example.noteably.util

import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.*
import androidx.recyclerview.widget.RecyclerView
import com.example.noteably.R
import com.example.noteably.model.ToDo

class ToDoAdapter(
    private var taskList: List<ToDo>,
    private val onMoreOptionsClicked: (ToDo) -> Unit
) : RecyclerView.Adapter<ToDoAdapter.ToDoViewHolder>() {

    class ToDoViewHolder(itemView: View) : RecyclerView.ViewHolder(itemView) {
        val checkBox: CheckBox = itemView.findViewById(R.id.taskCheckbox)
        val taskTitle: TextView = itemView.findViewById(R.id.taskTitle)
        val taskSchedule: TextView = itemView.findViewById(R.id.taskSchedule)
        val taskDescription: TextView = itemView.findViewById(R.id.taskDescription)
        val moreSetting: ImageButton = itemView.findViewById(R.id.moreSetting)
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ToDoViewHolder {
        val view = LayoutInflater.from(parent.context).inflate(R.layout.task_item, parent, false)
        return ToDoViewHolder(view)
    }

    override fun onBindViewHolder(holder: ToDoViewHolder, position: Int) {
        val task = taskList[position]

        holder.taskTitle.text = task.title
        holder.taskDescription.text = task.description
        //holder.taskSchedule.text = "Schedule ID: ${task.todolistID}" // Change this if you use actual schedule data

        // You can use this to track completion in the future
        holder.checkBox.isChecked = false

        holder.moreSetting.setOnClickListener {
            onMoreOptionsClicked(task)
        }
    }

    override fun getItemCount(): Int = taskList.size

    fun updateTasks(newList: List<ToDo>) {
        taskList = newList
        notifyDataSetChanged()
    }
}
