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


db.persons.aggregate([
    {
        $group: {
            _id: "$gender"
        }
    }
]);

//output in an object
db.persons.aggregate([
    {
        $group: {
            _id: "$company.location"
        }
    }
]);

// combining  multiple objects
db.persons.aggregate([
    {
        $group: {
            _id: {
                eyeColor: "$eyeColor",
                fruit: "$favoriteFruit",
                age: "$age"
            }
        }
    }
]);

// combining match & group
db.persons.aggregate([

    // stage 1
    {
        $match: {

            eyeColor: "blue", favoriteFruit: "strawberry"

        }
    },


//stage 2
    {
        $group:
        {
            _id: {
                fruit: "$favoriteFruit",
                age: "$age",
                eyeColor: "$eyeColor"
            },
        }

    }
]);


// combining group & match
db.persons.aggregate([

//stage 1
    {
        $group:
            {
                _id: {
                    fruit: "$favoriteFruit",
                    age: "$age",
                    eyeColor: "$eyeColor"
                },
            }

    },
    // stage 2
    {
        $match: {

            "_id.eyeColor": "blue"

        }
    },
]);


// combining match & group & count
db.persons.aggregate([

    // stage 1
    {
        $match: {

            eyeColor: "blue", favoriteFruit: "strawberry"

        }
    },


//stage 2
    {
        $group:
            {
                _id: {
                    fruit: "$favoriteFruit",
                    age: "$age",
                    eyeColor: "$eyeColor"
                },
            }

    },
    //stage 3
    {
        $count: "output"
    }
]);

// $project & $limit

db.persons.aggregate([

    // stage 1
    {
        $project:
            {
                name: 1,
                company: {
                    companyTitle: "$company.title",
                    companyLocation: "$company.location",
                    companyEmail: "$company.email"
                }
            }
    },

    {
        $sort:
            {
                "company.companyTitle": 1,
                "name": -1
            }
    },
    {
        $limit: 5 // showing 5 objects
    }
]);


// unwind
db.persons.aggregate([

    // stage 1
    {
        $limit: 2
    },
    {
        $unwind:
            {
                path: "$tags"
            }// showing 5 objects
    },
    {
        $group:
            {
            _id: "$tags"
        }
    },
    {
        $count : "count"
    }
]);



// accumulator
db.persons.aggregate([

    // stage 1
    {
        $limit: 2
    },
    {
        $unwind:
            {
                path: "$tags"
            }// showing 5 objects
    },
    {
        $group:
            {
                _id: "$tags",
                total : {$sum : 1}
            }
    }
]);



// multiple combination + projection

db.inventory.aggregate(
    [{
        $project: {
            inventoryLocation: 1,
            quantity: "$qty",
            productKey: {
                $split: ["$key", ":"]
            }
        }
    }, {
        $group: {
            _id: {
                inventoryLocation: "$inventoryLocation",
                baseId: {
                    $first: "$productKey"
                }
            },
            quantity: {
                $sum: "$quantity"
            }
        }
    }, {
        $project: {
            _id: 0,
            quantity: 1,
            inventoryLocation: "$_id.inventoryLocation",
            baseId: "$_id.baseId"
        }
    }, {$out: 'managedProductCounter'}]
);
