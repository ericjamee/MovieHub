function Logout(props: { children: React.ReactNode }) {
  const handleLogout = async (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();

    try {
      const response = await fetch(
        "https://cineniche-team-3-8-backend-eehrgvh4fhd7f8b9.eastus-01.azurewebsites.net/logout",
        {
          method: "POST",
          credentials: "include", // Ensure cookies are sent
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        window.location.href = "/login";
      } else {
        console.error("Logout failed:", response.status);
      }
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <a className="logout" href="#" onClick={handleLogout}>
      {props.children}
    </a>
  );
}

export default Logout;
