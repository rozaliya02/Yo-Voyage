const SignIn = () => {
  return (
    <div>
      <h1>Sign In</h1>
      <form method="post">
        <label htmlFor="username">Username:</label>
        <input type="text" id="username" name="username" required />
        
        <label htmlFor="password">Password:</label>
        <input type="password" id="password" name="password" required />
        
        <button type="submit">Sign In</button>
      </form>
    </div>
  );
}

export default SignIn;