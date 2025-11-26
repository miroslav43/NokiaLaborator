import { useEffect, useState } from 'react';

const API_URL = 'http://localhost:8000';

function App() {
  const [todos, setTodos] = useState([])
  const [categories, setCategories] = useState([])
  const [stats, setStats] = useState(null)
  
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [priority, setPriority] = useState('medium')
  const [categoryId, setCategoryId] = useState('')
  
  const [filterCompleted, setFilterCompleted] = useState('all')
  const [filterPriority, setFilterPriority] = useState('')
  const [filterCategory, setFilterCategory] = useState('')

  useEffect(() => {
    fetchTodos()
    fetchCategories()
    fetchStats()
  }, [filterCompleted, filterPriority, filterCategory])

  const fetchTodos = async () => {
    try {
      let url = `${API_URL}/todos?`
      if (filterCompleted !== 'all') {
        url += `completed=${filterCompleted === 'completed'}&`
      }
      if (filterPriority) {
        url += `priority=${filterPriority}&`
      }
      if (filterCategory) {
        url += `category_id=${filterCategory}&`
      }
      const response = await fetch(url)
      const data = await response.json()
      setTodos(data)
    } catch (error) {
      console.error('Error fetching todos:', error)
    }
  }

  const fetchCategories = async () => {
    try {
      const response = await fetch(`${API_URL}/categories`)
      const data = await response.json()
      setCategories(data)
    } catch (error) {
      console.error('Error fetching categories:', error)
    }
  }

  const fetchStats = async () => {
    try {
      const response = await fetch(`${API_URL}/todos/stats`)
      const data = await response.json()
      setStats(data)
    } catch (error) {
      console.error('Error fetching stats:', error)
    }
  }

  const addTodo = async (e) => {
    e.preventDefault()
    if (!title) return

    try {
      const response = await fetch(`${API_URL}/todos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          title, 
          description: description || null,
          priority,
          category_id: categoryId ? parseInt(categoryId) : null
        }),
      })
      const newTodo = await response.json()
      setTodos([newTodo, ...todos])
      setTitle('')
      setDescription('')
      setPriority('medium')
      setCategoryId('')
      fetchStats()
    } catch (error) {
      console.error('Error adding todo:', error)
    }
  }

  const toggleTodo = async (todo) => {
    try {
      const response = await fetch(`${API_URL}/todos/${todo.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed: !todo.completed }),
      })
      const updatedTodo = await response.json()
      setTodos(todos.map(t => (t.id === todo.id ? updatedTodo : t)))
      fetchStats()
    } catch (error) {
      console.error('Error updating todo:', error)
    }
  }

  const deleteTodo = async (id) => {
    try {
      await fetch(`${API_URL}/todos/${id}`, { method: 'DELETE' })
      setTodos(todos.filter(t => t.id !== id))
      fetchStats()
    } catch (error) {
      console.error('Error deleting todo:', error)
    }
  }

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'high': return '#ef4444'
      case 'medium': return '#f59e0b'
      case 'low': return '#10b981'
      default: return '#6b7280'
    }
  }

  const getCategoryColor = (categoryId) => {
    const category = categories.find(c => c.id === categoryId)
    return category?.color || '#3b82f6'
  }

  return (
    <div style={{ padding: '20px', maxWidth: '900px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      <h1 style={{ marginBottom: '10px' }}>📝 Advanced Todo App</h1>
      
      {stats && (
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(3, 1fr)', 
          gap: '10px', 
          marginBottom: '20px',
          padding: '15px',
          backgroundColor: '#f3f4f6',
          borderRadius: '8px'
        }}>
          <div>
            <div style={{ fontSize: '12px', color: '#6b7280' }}>Total</div>
            <div style={{ fontSize: '24px', fontWeight: 'bold' }}>{stats.total}</div>
          </div>
          <div>
            <div style={{ fontSize: '12px', color: '#6b7280' }}>Completed</div>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#10b981' }}>{stats.completed}</div>
          </div>
          <div>
            <div style={{ fontSize: '12px', color: '#6b7280' }}>Pending</div>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#ef4444' }}>{stats.pending}</div>
          </div>
        </div>
      )}
      
      <form onSubmit={addTodo} style={{ 
        marginBottom: '20px', 
        padding: '15px', 
        backgroundColor: '#fff',
        border: '1px solid #e5e7eb',
        borderRadius: '8px'
      }}>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Todo title..."
          style={{ width: '100%', padding: '8px', marginBottom: '10px', fontSize: '16px' }}
        />
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description (optional)..."
          style={{ width: '100%', padding: '8px', marginBottom: '10px', minHeight: '60px' }}
        />
        <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
          <select 
            value={priority} 
            onChange={(e) => setPriority(e.target.value)}
            style={{ flex: 1, padding: '8px' }}
          >
            <option value="low">🟢 Low Priority</option>
            <option value="medium">🟡 Medium Priority</option>
            <option value="high">🔴 High Priority</option>
          </select>
          <select 
            value={categoryId} 
            onChange={(e) => setCategoryId(e.target.value)}
            style={{ flex: 1, padding: '8px' }}
          >
            <option value="">No Category</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>
        <button type="submit" style={{ 
          width: '100%', 
          padding: '10px', 
          backgroundColor: '#3b82f6',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          fontWeight: 'bold'
        }}>
          ➕ Add Todo
        </button>
      </form>

      <div style={{ 
        display: 'flex', 
        gap: '10px', 
        marginBottom: '20px',
        padding: '10px',
        backgroundColor: '#f9fafb',
        borderRadius: '8px'
      }}>
        <select 
          value={filterCompleted} 
          onChange={(e) => setFilterCompleted(e.target.value)}
          style={{ flex: 1, padding: '6px' }}
        >
          <option value="all">All Todos</option>
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
        </select>
        <select 
          value={filterPriority} 
          onChange={(e) => setFilterPriority(e.target.value)}
          style={{ flex: 1, padding: '6px' }}
        >
          <option value="">All Priorities</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
        <select 
          value={filterCategory} 
          onChange={(e) => setFilterCategory(e.target.value)}
          style={{ flex: 1, padding: '6px' }}
        >
          <option value="">All Categories</option>
          {categories.map(cat => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>
      </div>

      <div>
        {todos.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#6b7280', padding: '40px' }}>
            No todos found. Add one above!
          </p>
        ) : (
          todos.map(todo => (
            <div key={todo.id} style={{ 
              padding: '15px', 
              marginBottom: '10px',
              backgroundColor: '#fff',
              border: '1px solid #e5e7eb',
              borderLeft: `4px solid ${getPriorityColor(todo.priority)}`,
              borderRadius: '4px'
            }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => toggleTodo(todo)}
                  style={{ marginTop: '4px' }}
                />
                <div style={{ flex: 1 }}>
                  <div style={{ 
                    fontSize: '16px',
                    fontWeight: '500',
                    textDecoration: todo.completed ? 'line-through' : 'none',
                    color: todo.completed ? '#9ca3af' : 'inherit',
                    marginBottom: '5px'
                  }}>
                    {todo.title}
                  </div>
                  {todo.description && (
                    <div style={{ 
                      fontSize: '14px', 
                      color: '#6b7280',
                      marginBottom: '8px'
                    }}>
                      {todo.description}
                    </div>
                  )}
                  <div style={{ display: 'flex', gap: '10px', fontSize: '12px' }}>
                    <span style={{ 
                      padding: '2px 8px', 
                      backgroundColor: getPriorityColor(todo.priority),
                      color: 'white',
                      borderRadius: '12px'
                    }}>
                      {todo.priority}
                    </span>
                    {todo.category_id && (
                      <span style={{ 
                        padding: '2px 8px', 
                        backgroundColor: getCategoryColor(todo.category_id),
                        color: 'white',
                        borderRadius: '12px'
                      }}>
                        {categories.find(c => c.id === todo.category_id)?.name}
                      </span>
                    )}
                    <span style={{ color: '#9ca3af' }}>
                      {new Date(todo.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <button 
                  onClick={() => deleteTodo(todo.id)} 
                  style={{ 
                    padding: '6px 12px',
                    backgroundColor: '#fee2e2',
                    color: '#ef4444',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontWeight: '500'
                  }}
                >
                  🗑️ Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default App
