const NotFoundPage = () => {
  // const { role, setRole } = useRole();
  // const navigate = useNavigate();
  // const logout = async () => {
  //   const { data } = await axios.get(
  //     `${import.meta.env.VITE_ENDPOINT}/logout`,
  //     {
  //       withCredentials: true,
  //     },
  //   );
  //   alert("NotFOunDpage");
  //   console.log(data);
  //   setRole(null);
  //   navigate("/");
  // };
  // useEffect(() => {
  //   logout();
  // }, []);

  return (
    <div className=" flex min-h-[calc(100vh-6rem)] flex-col items-center justify-center gap-2">
      <h1 className="text-6xl font-bold">404</h1>
      <h1 className="text-2xl font-bold">Page Not Found</h1>
    </div>
  );
};

export default NotFoundPage;
