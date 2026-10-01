import { Transition } from "react-transition-group";
import {
  useState,
  useEffect,
  createRef,
  Dispatch,
  SetStateAction,
} from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toRaw } from "../../utils/helper";
import { selectSideMenu } from "../../stores/sideMenuSlice";
import { useAppSelector } from "../../stores/hooks";
import { FormattedMenu, nestedMenu } from "../../layouts/SideMenu/side-menu";
import { linkTo, enter, leave } from "./mobile-menu";
import Lucide from "../../base-components/Lucide";
import logoUrl from "../../assets/images/Side_logo.png";
import clsx from "clsx";
import SimpleBar from "simplebar";
import { useLogin } from "../../pages/skart_sales/commoncomponents/LoginContextProvider/LoginContextProvider";

function Main() {
  const location = useLocation();
  const [formattedMenu, setFormattedMenu] = useState<
    Array<FormattedMenu | "divider">
  >([]);
  const sideMenuStore = useAppSelector(selectSideMenu);
  const mobileMenu = () => nestedMenu(toRaw(sideMenuStore), location);
  const [activeMobileMenu, setActiveMobileMenu] = useState(false);
  const scrollableRef = createRef<HTMLDivElement>();
 const { userdata } = useLogin();
 const permissions = userdata?.role_permission.map((item:any) => item.p_id);
  useEffect(() => {
    if (scrollableRef.current) {
      new SimpleBar(scrollableRef.current);
    }
    setFormattedMenu(mobileMenu());
  }, [sideMenuStore, location.pathname]);

  return (
    <>
      {/* BEGIN: Mobile Menu */}
      <div
        className={clsx([
          "w-full fixed bg-primary/90 z-[60] border-b border-white/[0.08] -mt-5 -mx-3 sm:-mx-8 mb-6 dark:bg-darkmode-800/90 md:hidden",
          "before:content-[''] before:w-full before:h-screen before:z-10 before:fixed before:inset-x-0 before:bg-black/90 before:transition-opacity before:duration-200 before:ease-in-out",
          !activeMobileMenu && "before:invisible before:opacity-0",
          activeMobileMenu && "before:visible before:opacity-100",
        ])}
      >
        <div className="h-[70px] px-3 sm:px-8 flex items-center">
          <a href="/backoffice/dashboard" className="flex mr-auto">
            <img
              className="w-[45%]"
              src={logoUrl}
              style={{ filter: "drop-shadow(5px 5px 3px #222)" }}
            />
          </a>
          <a href="#" onClick={(e) => e.preventDefault()}>
            <Lucide
              icon="BarChart2"
              className="w-8 h-8 text-white transform -rotate-90"
              onClick={() => {
                setActiveMobileMenu(!activeMobileMenu);
              }}
            />
          </a>
        </div>
        <div
          ref={scrollableRef}
          className={clsx([
            "h-screen z-20 top-0 left-0 w-[270px] -ml-[100%] bg-primary transition-all duration-300 ease-in-out dark:bg-darkmode-800",
            "[&[data-simplebar]]:fixed [&_.simplebar-scrollbar]:before:bg-black/50",
            activeMobileMenu && "ml-0",
          ])}
        >
          <a
            href="#"
            onClick={(e) => e.preventDefault()}
            className={clsx([
              "fixed top-0 right-0 mt-4 mr-4 transition-opacity duration-200 ease-in-out",
              !activeMobileMenu && "invisible opacity-0",
              activeMobileMenu && "visible opacity-100",
            ])}
          >
            <Lucide
              icon="XCircle"
              className="w-8 h-8 text-white transform -rotate-90"
              onClick={() => {
                setActiveMobileMenu(!activeMobileMenu);
              }}
            />
          </a>
          <ul className="py-2">
            {/* BEGIN: First Child */}
            {formattedMenu
              ?.filter((item?: any) => {
                if (item?.title == "Dashboard") {
                  return item;
                } else if (!item?.id) {
                  if (item?.title == "Sales Operations") {
                    const permission = userdata?.role_permission?.filter(
                      (pitem: any) =>
                        (pitem?.p_id == 271 ||
                          pitem?.p_id == 286 ||
                          pitem?.p_id == 292) &&
                        pitem?.read_permission == 1
                    );
                    if (permission?.length > 0) {
                      return item;
                    }
                    return;
                  }
                  if (item?.title == "Pricing Operations") {
                    const permission = userdata?.role_permission?.filter(
                      (pitem: any) =>
                        pitem?.p_id == 301 && pitem?.read_permission == 1
                    );
                    if (permission?.length > 0) {
                      return item;
                    }
                    return;
                  } else if (item?.title == "Accounts") {
                    const permission = userdata?.role_permission?.filter(
                      (pitem: any) =>
                        (pitem?.p_id == 284 ||
                          pitem?.p_id == 285 ||
                          pitem?.p_id == 335) &&
                        pitem?.read_permission == 1
                    );
                    if (permission?.length > 0) {
                      return item;
                    }
                    return;
                  } else if (item?.title == "Reports") {
                    const permission = userdata?.role_permission?.filter(
                      (pitem: any) =>
                        (pitem?.p_id == 26 || pitem?.p_id == 27) &&
                        pitem?.read_permission == 1
                    );
                    if (permission?.length > 0) {
                      return item;
                    }
                    return;
                  }
                } else {
                  const permission = userdata?.role_permission.filter(
                    (pitem: any) =>
                      pitem?.p_id == item?.id && pitem?.read_permission == 1
                  );
                  if (permission?.length > 0) {
                    return item;
                  }
                  return;
                }
              })
              ?.map((menu, menuKey) =>
                menu == "divider" ? (
                  <Divider as="li" className="my-6" key={menuKey}></Divider>
                ) : (
                  <li key={menuKey}>
                    <Menu
                      menu={menu}
                      formattedMenuState={[formattedMenu, setFormattedMenu]}
                      level="first"
                      setActiveMobileMenu={setActiveMobileMenu}
                    ></Menu>
                    {/* BEGIN: Second Child */}
                    {menu.subMenu && (
                      <Transition
                        in={menu.activeDropdown}
                        onEnter={enter}
                        onExit={leave}
                        timeout={300}
                      >
                        <ul
                          className={clsx([
                            "bg-black/10 rounded-lg mx-4 my-1 dark:bg-darkmode-700",
                            !menu.activeDropdown && "hidden",
                            menu.activeDropdown && "block",
                          ])}
                        >
                          {menu.subMenu
                            .filter((item) => {
                              // Handle specific titles with their respective IDs
                              if (item?.title === "Accounts") {
                                const AccountsIds = [284, 285, 335]; // Replace with the actual IDs for "Business Associate"
                                return item?.subMenu?.some((subItem) =>
                                  AccountsIds.includes(subItem.id)
                                );
                              } else if (item?.title === "Pricing Operations") {
                                const pricingIds = [301]; // Replace with the actual IDs for "Commodity"
                                return item?.subMenu?.some((subItem) =>
                                  pricingIds.includes(subItem.id)
                                );
                              } else if (item?.title === "Sales Operations") {
                                const ids = [286,292]; // Replace with the actual IDs for "Vendor"
                                return item?.subMenu?.some((subItem) =>
                                  ids.includes(subItem.id)
                                );
                              } else {
                                // Original permission-based filtering
                                const permission =
                                  userdata?.role_permission.find(
                                    (pitem) => pitem?.p_id === item?.id
                                  );
                                return (
                                  permission &&
                                  permission.read_permission !== 0 &&
                                  permissions.includes(item?.id)
                                );
                              }
                            })
                            .map((subMenu, subMenuKey) => (
                              <li
                                className="max-w-[1280px] w-full mx-auto"
                                key={subMenuKey}
                              >
                                <Menu
                                  menu={subMenu}
                                  formattedMenuState={[
                                    formattedMenu,
                                    setFormattedMenu,
                                  ]}
                                  level="second"
                                  setActiveMobileMenu={setActiveMobileMenu}
                                ></Menu>
                                {/* BEGIN: Third Child */}
                                {subMenu.subMenu && (
                                  <Transition
                                    in={subMenu.activeDropdown}
                                    onEnter={enter}
                                    onExit={leave}
                                    timeout={300}
                                  >
                                    <ul
                                      className={clsx([
                                        "bg-black/10 rounded-lg my-1 dark:bg-darkmode-600",
                                        !subMenu.activeDropdown && "hidden",
                                        subMenu.activeDropdown && "block",
                                      ])}
                                    >
                                      {subMenu.subMenu.map(
                                        (lastSubMenu, lastSubMenuKey) => (
                                          <li
                                            className="max-w-[1280px] w-full mx-auto"
                                            key={lastSubMenuKey}
                                          >
                                            <Menu
                                              menu={lastSubMenu}
                                              formattedMenuState={[
                                                formattedMenu,
                                                setFormattedMenu,
                                              ]}
                                              level="third"
                                              setActiveMobileMenu={
                                                setActiveMobileMenu
                                              }
                                            ></Menu>
                                          </li>
                                        )
                                      )}
                                    </ul>
                                  </Transition>
                                )}
                                {/* END: Third Child */}
                              </li>
                            ))}
                        </ul>
                      </Transition>
                    )}
                    {/* END: Second Child */}
                  </li>
                )
              )}
            {/* END: First Child */}
          </ul>
        </div>
      </div>
      {/* END: Mobile Menu */}
    </>
  );
}

function Menu(props: {
  menu: FormattedMenu;
  formattedMenuState: [
    (FormattedMenu | "divider")[],
    Dispatch<SetStateAction<(FormattedMenu | "divider")[]>>
  ];
  level: "first" | "second" | "third";
  setActiveMobileMenu: Dispatch<SetStateAction<boolean>>;
}) {
  const navigate = useNavigate();
  const [formattedMenu, setFormattedMenu] = props.formattedMenuState;

  return (
    <a
      href={props.menu.subMenu ? "#" : props.menu.pathname}
      className={clsx([
        "h-[50px] flex items-center text-white",
        props.level == "first" && "px-6",
        props.level != "first" && "px-4",
      ])}
      onClick={(event) => {
        event.preventDefault();
        linkTo(props.menu, navigate, props.setActiveMobileMenu);
        setFormattedMenu(toRaw(formattedMenu));
      }}
    >
      <div>
        <Lucide icon={props.menu.icon} />
      </div>
      <div className="flex items-center w-full ml-3">
        {props.menu.title}
        {props.menu.subMenu && (
          <div
            className={clsx([
              "transition ease-in duration-100 ml-auto",
              props.menu.activeDropdown && "transform rotate-180",
            ])}
          >
            <Lucide icon="ChevronDown" className="w-5 h-5" />
          </div>
        )}
      </div>
    </a>
  );
}

function Divider<C extends React.ElementType>(
  props: { as?: C } & React.ComponentPropsWithoutRef<C>
) {
  const { className, ...computedProps } = props;
  const Component = props.as || "div";

  return (
    <Component
      {...computedProps}
      className={clsx([
        props.className,
        "w-full h-px bg-white/[0.08] relative",
      ])}
    ></Component>
  );
}

export default Main;
