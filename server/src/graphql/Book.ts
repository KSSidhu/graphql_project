import { extendType, intArg, nonNull, objectType, stringArg } from "nexus";
import _ from "lodash";

export const Book = objectType({
	name: "Book",
	definition(b) {
		b.nonNull.int("id");
		b.nonNull.string("name");
		b.nonNull.string("genre");
	},
});

let books = [
	{ name: "Name of the Wind", genre: "Fantasy", id: 1 },
	{ name: "The Final Empire", genre: "Fantasy", id: 2 },
	{ name: "The Long Earth", genre: "Sci-Fi", id: 3 },
];

export const RootQuery = extendType({
	type: "Query",
	definition(t) {
		t.nonNull.list.nonNull.field("feed", {
			type: "Book",
			resolve(parents, args, context, info) {
				return books;
			},
		});
	},
});

export const BookQuery = extendType({
	type: "Query",
	definition(t) {
		t.nonNull.field("book", {
			type: "Book",
			args: {
				id: nonNull(intArg()),
			},
			resolve(parents, args, context, info) {
				return _.find(books, { id: args.id });
			},
		});
	},
});

export const BookMutation = extendType({
	type: "Mutation",
	definition(t) {
		t.nonNull.field("book", {
			type: "Book",
			args: {
				name: nonNull(stringArg()),
				genre: nonNull(stringArg()),
			},
			resolve(parent, args, context) {
				const { name, genre } = args;

				let idCount = books.length + 1;
				const book = {
					id: idCount,
					name: name,
					genre: genre,
				};
				books.push(book);
				return book;
			},
		});
	},
});
