describe('Library Management System', function() {
    // Mock Firebase initialization
    beforeAll(function() {
        firebase = {
            initializeApp: function(config) {},
            firestore: function() {
                return {
                    collection: function() {
                        return {
                            doc: function() {
                                return {
                                    set: function() {
                                        return Promise.resolve();
                                    }
                                };
                            }
                        };
                    }
                };
            },
            auth: function() {
                return {
                    onAuthStateChanged: function(callback) {
                        callback({}); // Mock user authentication
                    }
                };
            }
        };
    });
    global.document = {
        getElementById: function(id) {
            return { value: 'test' }; // Mock input values
        }
    };
});

    // Test for add_this function
    describe('add_this function', function() {
        it('should add a book to the database', async function() {
            // Mock DOM elements
            document.getElementById = jasmine.createSpy('HTML Element').and.callFake(function(id) {
                return { value: 'test' }; // Mock input values
            });

            // Call the add_this function
            await add_this();

            // Check if document was written successfully
            expect(console.log).toHaveBeenCalledWith("Document successfully written!");
        });

        it('should navigate to admin portal after adding a book', async function() {
            spyOn(window, 'alert'); // Mock window.alert method

            // Mock DOM elements
            document.getElementById = jasmine.createSpy('HTML Element').and.callFake(function(id) {
                return { value: 'test' }; // Mock input values
            });

            // Call the add_this function
            await add_this();

            // Check if window location is set to admin_portal.html
            expect(window.location.href).toContain('admin_portal.html');
        });

        it('should handle errors when adding a book', async function() {
            spyOn(console, 'error'); // Mock console.error method

            // Mock DOM elements
            document.getElementById = jasmine.createSpy('HTML Element').and.callFake(function(id) {
                return { value: 'test' }; // Mock input values
            });

            // Mock Firestore set method to throw an error
            spyOn(firebase.firestore().collection('books').doc(), 'set').and.returnValue(Promise.reject('Error'));

            // Call the add_this function
            await add_this();

            // Check if error was logged
            expect(console.error).toHaveBeenCalledWith("Error writing document: ", 'Error');
        });
    });
