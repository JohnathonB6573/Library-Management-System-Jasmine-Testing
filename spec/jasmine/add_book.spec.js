//https://jasmine.github.io/archives/2.0/introduction#:~:text=Jasmine%20has%20test%20double%20functions,matchers%20for%20interacting%20with%20spies.
describe("add_this function", function() {
    var originalFirebase;
    var setSpy, docSpy, collectionSpy;
    var fakePromise;

    beforeEach(function() {
        setSpy = jasmine.createSpy('set').and.returnValue(Promise.resolve("Document successfully written!"));
        docSpy = jasmine.createSpy('doc').and.returnValue({ set: setSpy });
        collectionSpy = jasmine.createSpy('collection').and.returnValue({ doc: docSpy });

        // Replace firebase with a mock
        originalFirebase = firebase;
        firebase = {
            firestore: jasmine.createSpy('firestore').and.returnValue({
                collection: collectionSpy
            }),
            initializeApp: jasmine.createSpy('initializeApp'),
            auth: jasmine.createSpyObj('auth', ['onAuthStateChanged'])
        };

        document.body.innerHTML = `
            <input id="book_code" value="1234">
            <input id="book_name" value="Test Book">
            <input id="author1" value="Author One">
            <input id="author2" value="Author Two">
            <input id="Subject" value="Test Subject">
            <input id="tags" value="test, book">
        `;

        spyOn(window, 'alert');
        spyOn(window.location, 'assign').and.callFake(function(url) {
            console.log("Redirecting to " + url);
        });

        firebase.auth().onAuthStateChanged.and.callFake(function(callback) {
            callback(true);
        });
    });

    afterEach(function() {
        firebase = originalFirebase;
    });

    it("should attempt to add a book to Firestore and handle success", function(done) {
        add_this();

        setTimeout(() => {
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
            expect(window.alert).toHaveBeenCalledWith("Successfully Book Added");
            expect(window.location.assign).toHaveBeenCalledWith('admin_portal.html');
            done();
        }, 10);
    });

    it("should handle Firestore errors correctly", function(done) {
        // Simulate a Firestore error
        setSpy.and.returnValue(Promise.reject(new Error("Error writing document")));

        add_this();

        setTimeout(() => {
            expect(console.error).toHaveBeenCalledWith("Error writing document: ", jasmine.any(Error));
            done();
        }, 10);
    });
});
