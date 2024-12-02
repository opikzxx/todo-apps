import React from "react";
import CardTask from "../elements/CardTask";
import useStore from "../utils/useStore";

const Completed = () => {
  const { tasks } = useStore();

  const completedTasks = tasks.filter((task) => task.status === "completed");

  return (
    <div className="flex flex-col gap-1">
      {completedTasks.length > 0 ? (
        completedTasks.map((task) => <CardTask key={task?.id} task={task} />)
      ) : (
        <div className="text-center text-white p-4">
          <p>No completed tasks available.</p>
        </div>
      )}
    </div>
  );
};

export default Completed;
