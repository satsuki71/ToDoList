//https://grippy.learn.pierre-godino.com/api/mock/react-todo

import { useEffect, useState, type FC, type FormEvent } from 'react';
import './style.scss';

type Tasks = {
  createdAt: number;
  done: boolean;
  id: number;
  priority: string;
  title: string;
};

const ToDoList: FC = () => {
  //Déclarer les states
  const [toDoList, setToDoList] = useState<Tasks[]>([]);
  const [title, setTitle] = useState<string>('');
  const [filter, setFilter] = useState<'all' | 'done' | 'toBeDone'>('all');
  const [sortBy, setSortBy] = useState<'date' | 'priority'>('date');

  //On récupère les données avec fetch. Le tout est dans UseEffect afin de ne les récupérer qu'une fois au démarrage
  useEffect(() => {
    const getToDoList = async () => {
      const response = await fetch(
        'https://grippy.learn.pierre-godino.com/api/mock/react-todo'
      );
      const data = await response.json();
      setToDoList(data.tasks);
    };

    getToDoList().catch((error) => console.error(`Catch error ${error}`));
  }, []);

  //On définie une fonction pour ajouter une nouvelle tâche
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    //FormEvent => import qui déclanche l'évenement (peut avoir MouseEvent ou KeyboardEvent, ...)
    //Entre chevrons indique de quelle balise exact vient
    e.preventDefault();
    //On créé un nouveau tableau pour lequel on met les données pour les nouveaux éléments ajoutés à la liste
    const NewTaskArray = {
      createdAt: Date.now(),
      done: false,
      id: Date.now(),
      priority: 'low',
      title: title.trim(),
    };
    setToDoList([...toDoList, NewTaskArray]);
    setTitle('');
  };

  const handleDelete = (idToDelete: number) => {
    setToDoList(toDoList.filter((toDoList) => toDoList.id !== idToDelete));
  };

  const changePriority = (id: number) => {
    const updatedArray = toDoList.map((task) => {
      if (task.id === id) {
        let newPriority = 'low';
        if (task.priority === 'low') newPriority = 'medium';
        if (task.priority === 'medium') newPriority = 'high';
        if (task.priority === 'high') newPriority = 'low';
        return { ...task, priority: newPriority };
      }
      return task;
    });
    setToDoList(updatedArray);
  };

  const checkIsDone = (id: number) => {
    setToDoList((prevState) =>
      prevState.map((toDo) =>
        toDo.id === id ? { ...toDo, done: !toDo.done } : toDo
      )
    );
  };

  const FilteredArray = toDoList.filter((task) => {
    if (filter === 'done') return task.done;
    if (filter === 'toBeDone') return !task.done;
    return true;
  });

  const sortedTasks = [...FilteredArray].sort((a, b) => {
    if (sortBy === 'priority') {
      const order = { high: 0, medium: 1, low: 2 };
      return (
        order[a.priority as 'low' | 'medium' | 'high'] -
        order[b.priority as 'low' | 'medium' | 'high']
      );
    }
    return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
  });

  return (
    <div className="main-composant">
      <h1>Gestionnaire de tâches</h1>

      <form method="post" onSubmit={handleSubmit}>
        <input
          type="text"
          name="add-task"
          id="add-task"
          placeholder="Ajouter une tâche ..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <button type="submit">Ajouter</button>
      </form>

      <div className="sorting">
        <ul>
          <li>
            <button
              className={filter === 'all' ? 'selected-button' : ''}
              onClick={() => setFilter('all')}
            >
              Toutes
            </button>
          </li>
          <li>
            <button
              className={filter === 'toBeDone' ? 'selected-button' : ''}
              onClick={() => setFilter('toBeDone')}
            >
              A faire
            </button>
          </li>
          <li>
            <button
              className={filter === 'done' ? 'selected-button' : ''}
              onClick={() => setFilter('done')}
            >
              Faites
            </button>
          </li>
        </ul>
        <select
          name="sorting-select"
          id="sorting-select"
          onChange={(e) => setSortBy(e.target.value as 'date' | 'priority')}
        >
          <option value="date">Date</option>
          <option value="priority">Priorité</option>
        </select>
      </div>

      <ul className="tasks-list">
        {sortedTasks.map((item: Tasks) => (
          <li key={item.id}>
            <div className="list">
              <input
                type="checkbox"
                name="list-item"
                id={`item_no_${item.id}`}
                checked={item.done}
                onChange={() => checkIsDone(item.id)}
              />
              <label
                htmlFor={`item_no_${item.id}`}
                style={{
                  textDecoration: item.done ? 'line-through' : '',
                  opacity: item.done ? '0.5' : '1',
                }}
              >
                {item.title}
              </label>
            </div>

            <div className="list-buttons">
              <button onClick={() => changePriority(item.id)}>
                {item.priority}
              </button>
              <button onClick={() => handleDelete(item.id)}>X</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ToDoList;
