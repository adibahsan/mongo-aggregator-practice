use test

// match
db.persons.aggregate([
    {
        $match: {
            tags: {$size: 3}
        }
    }
]);


//group

db.persons.aggregate([
    {
        $group: {
            _id: "$age"
        }
    }
]);
