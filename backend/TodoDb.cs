using Microsoft.EntityFrameworkCore;

/*

    This class is the database context for the Todo application.
    It inherits from DbContext and provides access to the Todos
    table in the database.
*/
class TodoDb : DbContext
{
    public TodoDb(DbContextOptions<TodoDb> options)
        : base(options)
    { }
    public DbSet<Todo> Todos => Set<Todo>();
}