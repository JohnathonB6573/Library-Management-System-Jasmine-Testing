
describe('Admin login', function login() {
  beforeEach(function() {
      // Set up Firebase mock
      firebase = {
          auth: function() {
              return {
                  signInWithEmailAndPassword: jasmine.createSpy().and.returnValue(Promise.resolve()),
                  signOut: jasmine.createSpy().and.returnValue(Promise.resolve())
              };
          }
      };
  });

  it('should log in the admin with correct credentials', function(done) {
      // Set up HTML fixture
      document.body.innerHTML = `
          <form id="login-form">
              <input type="email" id="username" value="admin@gmail.com">
              <input type="password" id="password" value="admin123">
              <button id="submit_data"></button>
          </form>
      `;

      // Call login function
      login();

      // Expect signInWithEmailAndPassword to be called with correct credentials
      expect(firebase.auth().signInWithEmailAndPassword).toHaveBeenCalledWith('admin@gmail.com', 'admin123');

      // Wait for the promises to resolve
      setTimeout(function() {
          // Expect redirection to admin portal
          expect(window.location.href).toBe('admin_portal.html');
          done();
      }, 0);
  });

  it('should not log in with incorrect credentials', function(done) {
      // Set up HTML fixture
      document.body.innerHTML = `
          <form id="login-form">
              <input type="email" id="username" value="admin@gmail.com">
              <input type="password" id="password" value="wrongpassword">
              <button id="submit_data"></button>
          </form>
      `;

      // Call login function
      login();

      // Expect signInWithEmailAndPassword to be called with incorrect credentials
      expect(firebase.auth().signInWithEmailAndPassword).toHaveBeenCalledWith('admin@gmail.com', 'wrongpassword');

      // Wait for the promises to resolve
      setTimeout(function() {
          // Expect no redirection
          expect(window.location.href).not.toBe('admin_portal.html');
          done();
      }, 0);
  });
});
