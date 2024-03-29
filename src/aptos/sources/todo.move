module todo_addr::Todo {
    // 0x1 is the standard library address for these basic types
    use std::string;
    use std::signer;
    use std::vector;
    use aptos_framework::event;

    // Resources
    // Key:  Allows the resource stored under address to be identified by the address
    // Drop: Allows this resource to be dropped (maybe I'll add option to remove the Task)
    // Allows resource to be moved arround
    //:!:>resource
    struct Task has key, drop, store {
        id: u64,
        content: string::String,
        completed: bool,
    }
    //:!:>resource

    //:!:>resource
    struct Todo has key {
        count: u64,
        tasks: vector<Task>,
        numCompleted: u64,
    }
    //:!:>resource

    public entry fun initialize(account: &signer) {
        // move_to: Creates a new resource for a specific type
        // Here we are creating a Todo resource
        move_to(account, Todo {
            count: 0,
            tasks: vector::empty(),
            numCompleted: 0,
        });
    }

    // Events
    // index is used for the order of events
    #[event(msg = b"A task was created")]
    struct TaskCreated has drop, store  {
        id: u64,
        content: string::String,
        completed: bool,
    }

    // Events
    #[event(msg = b"A task was completed")]
    struct TaskCompleted has drop, store {
        id: u64,
        completed: bool,
    }

    // acquires is required because we are mutating the Todo resource
    public entry fun create_task(account: &signer, content: string::String) acquires Todo {
        // getting mutable reference to Todo that is stored add address from account
        let todo = borrow_global_mut<Todo>(signer::address_of(account));
        // incrementing the count
        todo.count = todo.count + 1;
        let id = todo.count;
        let task = Task {
            id: id,
            content: content,
            completed: false,
        };
        // Adding task to the todo
        vector::push_back(&mut todo.tasks, task);
        event::emit(TaskCreated {
            id: id,
            content: content,
            completed: false,
        });
    }

    public entry fun check_task(account: &signer, index: u64) acquires Todo {
        // getting mutable reference to Todo that is stored add address from account
        let todo = borrow_global_mut<Todo>(signer::address_of(account));
        // Getting reference to task at 
        let task = vector::borrow_mut<Task>(&mut todo.tasks, index);
        // Setting task to completed
        task.completed = true;
        todo.numCompleted = todo.numCompleted + 1;
        event::emit(TaskCompleted {
            id: index,
            completed: task.completed,
        });
    }
}