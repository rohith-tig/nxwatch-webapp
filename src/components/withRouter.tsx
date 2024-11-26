import { useNavigate } from "react-router-dom";

export const withRouter = (Component: any) => {
  function ComponentWithRouterProp(props: any) {
    const navigate = useNavigate();
    return <Component {...props} navigate={navigate} />;
  }
  return ComponentWithRouterProp;
};
