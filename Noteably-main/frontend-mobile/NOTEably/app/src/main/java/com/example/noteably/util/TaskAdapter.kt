package com.example.noteably.util

import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.TextView
import androidx.recyclerview.widget.RecyclerView
import com.example.noteably.R
import com.example.noteably.model.ToDo

class TaskAdapter(
    tasks: List<ToDo>,
    private val onDeleteClick: (Int) -> Unit
) : RecyclerView.Adapter<TaskAdapter.TaskViewHolder>() {
    private var tasks: MutableList<ToDo> = tasks.toMutableList()

    inner class TaskViewHolder(itemView: View) : RecyclerView.ViewHolder(itemView) {
        val textViewTitle: TextView = itemView.findViewById(R.id.taskTitle)
        val textViewDescription: TextView = itemView.findViewById(R.id.taskDescription)
        //val buttonDelete: TextView = itemView.findViewById(R.id.buttonDelete) // If you later add a delete button
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): TaskViewHolder {
        val view = LayoutInflater.from(parent.context).inflate(R.layout.task_item, parent, false)
        return TaskViewHolder(view)
    }

    override fun getItemCount(): Int = tasks.size

    override fun onBindViewHolder(holder: TaskViewHolder, position: Int) {
        val task = tasks[position]
        holder.textViewTitle.text = task.title
        holder.textViewDescription.text = task.description

        /*holder.buttonDelete.setOnClickListener {
            onDeleteClick(task.todolistID)
        }*/
    }

    fun updateData(newTasks: List<ToDo>) {
        tasks.clear()
        tasks.addAll(newTasks)
        notifyDataSetChanged()
    }
}