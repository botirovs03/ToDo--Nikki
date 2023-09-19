/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
    const tableExists = await knex.schema.hasTable('tasks');
    if (!tableExists) {
        return knex.schema.createTable('tasks', (table) => {
            table.increments('TaskID').primary();
            table.integer('UserID').unsigned();
            table.integer('CategoryID').unsigned();
            table.string('TaskName');
            table.text('Description');
            table.string('Priority');
            table.date('Deadline');
            table.boolean('Completed');
            table.timestamp('CompletedDate');
            table.foreign('UserID').references('users.UserID');
            table.foreign('CategoryID').references('categories.CategoryID').onDelete('CASCADE');
        });
    }
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
    return knex.schema.dropTableIfExists('tasks');
};
