import Dexie from "dexie";

export default class DataBase {
    constructor() {
        this.db = new Dexie("toDoDataBase");
        this.db.version(1).stores({
            taskList: 'id,title,description,color,isArchive,dueDate'
        });
    }
    async getTasks() {
        try {
            return await this.db.taskList.toArray();
        } catch (error) {
            this.status = `Не удалось получить данные`;
        }
    }
    async addTask(task) {
        try {
            this.db.taskList.get({id: task.id}).then((taskExist) => {
                if(!taskExist) {
                    this.db.taskList.add(task);
                } else {
                    this.db.taskList.update(task.id, task);
                }
            })
        } catch (error) {
            this.status = `Не удалось добавить данные`;
        }
    }
    async deleteTask(task) {
        try {
            this.db.taskList.delete(task.id);
        } catch (error) {
            this.status = `Не удалось удалить данные`;
        }
    }
    async changeTaskStatus(task) {
        try {
            this.db.taskList.update(task.id, {isArchive: !isArchive});
        } catch (error) {
            this.status = `Не удалось удалить данные`;
        }
    }
}