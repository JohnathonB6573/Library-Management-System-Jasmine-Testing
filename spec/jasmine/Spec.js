describe("add_this", function() {
    var originalFirebase;
    var setSpy, docSpy, collectionSpy;
    var fakePromise;

    beforeEach(function() {
        setSpy = jasmine.createSpy('set').and.callFake(() => Promise.resolve("Document successfully written!"));
        docSpy = jasmine.createSpy('doc').and.returnValue({ set: setSpy });
        collectionSpy = jasmine.createSpy('collection').and.returnValue({ doc: docSpy });

        originalFirebase = firebase.firestore;
        firebase.firestore = jasmine.createSpy('firestore').and.returnValue({
            collection: collectionSpy
        });

        spyOn(window, 'alert');
        spyOn(window, 'location', 'get').and.returnValue({});

        document.body.innerHTML = `
            <input id="book_code" value="1234">
            <input id="book_name" value="Test Book">
            <input id="author1" value="Author One">
            <input id="author2" value="Author Two">
            <input id="Subject" value="Test Subject">
            <input id="tags" value="test, book">
        `;

        fakePromise = Promise.resolve();
    });

    afterEach(function() {

        firebase.firestore = originalFirebase;
    });

    it("should attempt to add a book to the database", function(done) {
        add_this();

        setTimeout(() => { // Timeout to allow Promise resolution
            expect(firebase.firestore).toHaveBeenCalled();
            expect(collectionSpy).toHaveBeenCalledWith("books");
            expect(docSpy).toHaveBeenCalledWith("1234");
            expect(setSpy).toHaveBeenCalledWith({
                bookcode: "1234",
                bookname: "Test Book",
                author1: "Author One",
                author2: "Author Two",
                subject: "Test Subject",
                tags: "test, book"
            });
            done();
        }, 1);
    });

    it("should alert the user when the book is successfully added", function(done) {
        add_this();

        fakePromise.then(() => {
            expect(window.alert).toHaveBeenCalledWith("Successfully Book Added");
            done();
        });
    });

    it("should handle errors correctly", function(done) {
        setSpy.and.callFake(() => Promise.reject(new Error("Error writing document")));
        add_this();

        fakePromise.catch((error) => {
            expect(window.alert).not.toHaveBeenCalledWith("Successfully Book Added");
            expect(console.error).toHaveBeenCalledWith("Error writing document: ", error);
            done();
        });
    });
});
