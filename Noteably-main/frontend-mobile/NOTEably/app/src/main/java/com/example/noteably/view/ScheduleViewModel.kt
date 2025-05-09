package com.example.noteably.view
import androidx.lifecycle.*
import com.example.noteably.model.ScheduleModel
import com.example.noteably.repository.ScheduleRepository
import kotlinx.coroutines.launch

class ScheduleViewModel(private val repository: ScheduleRepository) : ViewModel() {

    private val _schedules = MutableLiveData<List<ScheduleModel>>()
    val schedules: LiveData<List<ScheduleModel>> = _schedules

    fun fetchSchedules(studentId: Int) {
        viewModelScope.launch {
            try {
                _schedules.value = repository.getSchedulesByStudent(studentId)
            } catch (e: Exception) {
                _schedules.value = emptyList()
            }
        }
    }
}
