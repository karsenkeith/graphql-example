const { GraphQLObjectType, GraphQLString, GraphQLSchema, GraphQLList, GraphQLInt, GraphQLNonNull } = require('graphql');
const database = require('./database.json');
const fs = require('fs');

// CUSTOM TYPES
const AuthorType = new GraphQLObjectType({
    name: 'AuthorType',
    description: 'A single author.',
    fields: () => ({
        id: {
            type: GraphQLNonNull(GraphQLInt),
        },
        name: {
            type: GraphQLNonNull(GraphQLString),
        },
        books: {
            type: new GraphQLList(BookType),
            description: 'List of books the author has written.',
            resolve: (parent) => {
                return database.books.filter((book) => book.authorID === parent.id);
            },
        },
    }),
});

const BookType = new GraphQLObjectType({
    name: 'BookType',
    description: 'A single book.',
    fields: () => ({
        id: {
            type: GraphQLNonNull(GraphQLInt),
        },
        name: {
            type: GraphQLNonNull(GraphQLString),
        },
        authorID: {
            type: GraphQLNonNull(GraphQLInt),
        },
        author: {
            type: AuthorType,
            resolve: (parent) => {
                return database.authors.find((author) => author.id === parent.authorID);
            },
        },
    }),
});

// ROOT QUERY ENDPOINT
const RootQuery = new GraphQLObjectType({
    name: 'Query',
    description: 'Root query to retrieve all information stored in the database.',
    fields: () => ({
        books: {
            type: new GraphQLList(BookType),
            description: 'List of all books in the database.',
            resolve: () => database.books,
        },
        authors: {
            type: new GraphQLList(AuthorType),
            description: 'List of all authors in the database.',
            resolve: () => database.authors,
        },
        book: {
            type: BookType,
            description: "A single book identified by it's id.",
            args: {
                id: {
                    type: GraphQLInt,
                },
            },
            resolve: (parent, args) => {
                return database.books.find((book) => book.id === args.id);
            },
        },
        author: {
            type: AuthorType,
            description: "A single author identified by it's id.",
            args: {
                id: {
                    type: GraphQLInt,
                },
            },
            resolve: (parent, args) => {
                return database.authors.find((author) => author.id === args.id);
            },
        },
    }),
});

// ROOT MUTATION ENDPOOINT
const RootMutation = new GraphQLObjectType({
    name: 'Mutation',
    description: 'Root mutation to manipulate all information stored in the database.',
    fields: () => ({
        // CRUD FOR BOOK TYPE
        createBook: {
            type: BookType,
            description: 'Adds a single book to the database.',
            args: {
                name: {
                    type: GraphQLNonNull(GraphQLString),
                },
                authorID: {
                    type: GraphQLNonNull(GraphQLInt),
                },
            },
            resolve: (parent, args) => {
                const newBook = {
                    id: database.books.length + 1,
                    name: args.name,
                    authorID: args.authorID,
                };
                database.books.push(newBook);
                fs.writeFile('database.json', JSON.stringify(database), (err) => {
                    if (err) throw err;
                    console.log('Saved book!');
                });
                return newBook;
            },
        },
        updateBook: {
            type: BookType,
            description: 'Updates a single book in the database.',
            args: {
                id: {
                    type: GraphQLNonNull(GraphQLInt),
                    description: 'ID of the book to update.',
                },
                name: {
                    type: GraphQLString,
                    description: 'New name of the book.',
                },
                authorID: {
                    type: GraphQLInt,
                    description: 'ID of the new author of the book.',
                },
            },
            resolve: (parent, args) => {
                let bookResult = database.books.find((book) => book.id === args.id);
                console.log(args);
                if (args.name || args.authorID) {
                    if (args.name) bookResult.name = args.name;
                    if (args.authorID) bookResult.authorID = args.authorID;

                    fs.writeFile('database.json', JSON.stringify(database), (err) => {
                        if (err) throw err;
                        console.log('Updated book!');
                    });

                    return database.books.find((book) => book.id === args.id);
                } else {
                    return bookResult;
                }
            },
        },
        deleteBook: {
            type: BookType,
            description: 'Deletes a single book from the database.',
            args: {
                id: {
                    type: GraphQLNonNull(GraphQLInt),
                    description: 'ID of the book to delete.',
                },
            },
            resolve: (parent, args) => {
                let bookResult = database.books.find((book) => book.id === args.id);
                database.books = database.books.filter((book) => book.id !== args.id);

                fs.writeFile('database.json', JSON.stringify(database), (err) => {
                    if (err) throw err;
                    console.log('Deleted book!');
                });

                return bookResult;
            },
        },
        // CRUD FOR AUTHOR TYPE
        createAuthor: {
            type: AuthorType,
            description: 'Adds a single author to the database.',
            args: {
                name: {
                    type: GraphQLNonNull(GraphQLString),
                },
            },
            resolve: (parent, args) => {
                const newAuthor = {
                    id: database.authors.length + 1,
                    name: args.name,
                };
                database.authors.push(newAuthor);
                fs.writeFile('database.json', JSON.stringify(database), (err) => {
                    if (err) throw err;
                    console.log('Saved author!');
                });
                return newAuthor;
            },
        },
        updateAuthor: {
            type: AuthorType,
            description: 'Updates a single author in the database.',
            args: {
                id: {
                    type: GraphQLNonNull(GraphQLInt),
                    description: 'ID of the author to update.',
                },
                name: {
                    type: GraphQLString,
                    description: 'New name of the author.',
                },
            },
            resolve: (parent, args) => {
                let authorResult = database.authors.find((author) => author.id === args.id);
                console.log(args);
                if (args.name || args.authorID) {
                    if (args.name) authorResult.name = args.name;
                    if (args.authorID) authorResult.authorID = args.authorID;

                    fs.writeFile('database.json', JSON.stringify(database), (err) => {
                        if (err) throw err;
                        console.log('Updated author!');
                    });

                    return database.authors.find((author) => author.id === args.id);
                } else {
                    return authorResult;
                }
            },
        },
        deleteAuthor: {
            type: AuthorType,
            description: 'Deletes a single author from the database.',
            args: {
                id: {
                    type: GraphQLNonNull(GraphQLInt),
                    description: 'ID of the author to delete.',
                },
            },
            resolve: (parent, args) => {
                let authorResult = database.authors.find((author) => author.id === args.id);
                database.authors = database.authors.filter((author) => author.id !== args.id);

                fs.writeFile('database.json', JSON.stringify(database), (err) => {
                    if (err) throw err;
                    console.log('Deleted author!');
                });

                return authorResult;
            },
        },
    }),
});

// EXPORT SCHEMA
module.exports = schema = new GraphQLSchema({
    query: RootQuery,
    mutation: RootMutation,
});
