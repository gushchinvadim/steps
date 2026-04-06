import { useState } from 'react'
import './App.css'

function App() {
  // Начальные данные из скриншота
  const [data, setData] = useState([
    { date: '20.01.2026', distance: 5.7 },
    { date: '19.02.2026', distance: 14.2 },
    { date: '18.03.2026', distance: 3.4 }
  ])
  
  const [date, setDate] = useState('')
  const [distance, setDistance] = useState('')
  const [editIndex, setEditIndex] = useState(null)

  // Преобразование даты в объект Date для сортировки
  const parseDate = (dateStr) => {
    const parts = dateStr.split('.')
    if (parts.length !== 3) return null
    // Формат ДД.ММ.ГГГГ -> создаем Date
    return new Date(`${parts[2]}-${parts[1]}-${parts[0]}`)
  }

  // Валидация формата даты
  const isValidDate = (dateStr) => {
    const regex = /^\d{2}\.\d{2}\.\d{4}$/
    if (!regex.test(dateStr)) return false
    const date = parseDate(dateStr)
    return date !== null && !isNaN(date.getTime())
  }

  // Добавление или обновление данных
  const handleSubmit = (e) => {
    e.preventDefault()
    
    // Валидация
    if (!date || !distance) {
      alert('Заполните все поля')
      return
    }
    
    if (!isValidDate(date)) {
      alert('Неверный формат даты. Используйте ДД.ММ.ГГГГ')
      return
    }
    
    const numDistance = parseFloat(distance)
    if (isNaN(numDistance) || numDistance <= 0) {
      alert('Введите корректное расстояние')
      return
    }

    if (editIndex !== null) {
      // РЕДАКТИРОВАНИЕ: удаляем старую запись и добавляем новую
      const newData = [...data]
      newData.splice(editIndex, 1)
      
      // Проверяем, есть ли уже такая дата
      const existingIndex = newData.findIndex(item => item.date === date)
      
      if (existingIndex !== -1) {
        // Если дата есть - суммируем
        newData[existingIndex].distance += numDistance
      } else {
        // Если даты нет - добавляем новую
        newData.push({ date, distance: numDistance })
      }
      
      // Сортируем по убыванию даты
      newData.sort((a, b) => parseDate(b.date) - parseDate(a.date))
      
      setData(newData)
      setEditIndex(null)
    } else {
      // ДОБАВЛЕНИЕ: проверяем, есть ли уже такая дата
      const existingIndex = data.findIndex(item => item.date === date)
      
      let newData
      
      if (existingIndex !== -1) {
        // Дата существует - суммируем расстояния
        newData = data.map((item, index) => {
          if (index === existingIndex) {
            return {
              ...item,
              distance: item.distance + numDistance
            }
          }
          return item
        })
      } else {
        // Новая дата - добавляем запись
        newData = [...data, { date, distance: numDistance }]
        // Сортируем по убыванию даты (новые даты сверху)
        newData.sort((a, b) => parseDate(b.date) - parseDate(a.date))
      }
      
      setData(newData)
    }
    
    // Очистка формы
    setDate('')
    setDistance('')
  }

  // Удаление записи
  const handleDelete = (index) => {
    const newData = data.filter((_, i) => i !== index)
    setData(newData)
  }

  // Редактирование записи
  const handleEdit = (index) => {
    setDate(data[index].date)
    setDistance(data[index].distance.toString())
    setEditIndex(index)
    // Прокрутка к форме
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Отмена редактирования
  const handleCancel = () => {
    setDate('')
    setDistance('')
    setEditIndex(null)
  }

  return (
    <div className="container">
      <div className="form-container">
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label>Дата (ДД.ММ.ГГ)</label>
              <input
                type="text"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                placeholder="01.01.2026"
                maxLength="10"
              />
            </div>
            
            <div className="form-group">
              <label>Пройдено км</label>
              <input
                type="number"
                step="0.1"
                min="0"
                value={distance}
                onChange={(e) => setDistance(e.target.value)}
                placeholder="1.7"
              />
            </div>
            
            <button 
              type="submit" 
              className="submit-btn"
            >
              {editIndex !== null ? 'Сохранить' : 'OK'}
            </button>
            
            {editIndex !== null && (
              <button 
                type="button" 
                className="submit-btn"
                onClick={handleCancel}
                style={{ marginLeft: '10px', backgroundColor: '#ffe6e6' }}
              >
                Отмена
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="data-table">
        <div className="table-header">
          <div className="col-date">Дата (ДД.ММ.ГГ)</div>
          <div className="col-distance">Пройдено км</div>
          <div className="col-actions">Действия</div>
        </div>
        
        <div className="table-body">
          {data.length === 0 ? (
            <div className="empty-state">
              Нет данных. Добавьте первую запись!
            </div>
          ) : (
            data.map((item, index) => (
              <div key={`${item.date}-${index}`} className="table-row">
                <div className="col-date">{item.date}</div>
                <div className="col-distance">{item.distance}</div>
                <div className="col-actions">
                  <button 
                    className="action-btn edit-btn"
                    onClick={() => handleEdit(index)}
                    title="Редактировать"
                  >
                    ✎
                  </button>
                  <button 
                    className="action-btn delete-btn"
                    onClick={() => handleDelete(index)}
                    title="Удалить"
                  >
                    ✘
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

export default App