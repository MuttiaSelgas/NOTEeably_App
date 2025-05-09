package com.example.noteably.util

import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.ImageButton
import android.widget.TextView
import androidx.recyclerview.widget.RecyclerView
import com.example.noteably.R
import com.example.noteably.model.ScheduleModel

class ScheduleAdapter(
    private val onMoreClick: (View, ScheduleModel) -> Unit
) : RecyclerView.Adapter<ScheduleAdapter.ScheduleViewHolder>() {

    private val scheduleList = mutableListOf<ScheduleModel>()

    inner class ScheduleViewHolder(itemView: View) : RecyclerView.ViewHolder(itemView) {
        val title: TextView = itemView.findViewById(R.id.scheduleTitle)
        val priority: TextView = itemView.findViewById(R.id.schedulePriority)
        val startDate: TextView = itemView.findViewById(R.id.scheduleStart)
        val endDate: TextView = itemView.findViewById(R.id.scheduleEnd)
        val moreActions: ImageButton = itemView.findViewById(R.id.moreActions)
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ScheduleViewHolder {
        val view = LayoutInflater.from(parent.context).inflate(R.layout.schedule_item, parent, false)
        return ScheduleViewHolder(view)
    }

    override fun onBindViewHolder(holder: ScheduleViewHolder, position: Int) {
        val schedule = scheduleList[position]
        holder.title.text = schedule.title
        holder.priority.text = "Priority: ${schedule.priority}"
        holder.startDate.text = "Start: ${schedule.startDate}"
        holder.endDate.text = "End: ${schedule.endDate ?: "N/A"}"

        holder.moreActions.setOnClickListener {
            onMoreClick(it, schedule)
        }
    }

    override fun getItemCount(): Int = scheduleList.size

    fun submitList(data: List<ScheduleModel>) {
        scheduleList.clear()
        scheduleList.addAll(data)
        notifyDataSetChanged()
    }

    fun removeItem(schedule: ScheduleModel) {
        val index = scheduleList.indexOfFirst { it.scheduleID == schedule.scheduleID }
        if (index != -1) {
            scheduleList.removeAt(index)
            notifyItemRemoved(index)
        }
    }

    fun updateItem(updated: ScheduleModel) {
        val index = scheduleList.indexOfFirst { it.scheduleID == updated.scheduleID }
        if (index != -1) {
            scheduleList[index] = updated
            notifyItemChanged(index)
        }
    }

}