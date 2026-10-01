import logoUrl from "../../assets/images/Side_logo.png";
import { FormInput, FormLabel, InputGroup } from "../../base-components/Form";
import Button from "../../base-components/Button";
import { LoginCredential } from "../../DataTypes/dataTypes";
import { useEffect, useRef, useState } from "react";
import {
  commongetrequest,
  commonpostrequest,
} from "../../AllServices/services";
import { useAlert } from "../../ContextProvider/AlertContext";
import { Link, useNavigate } from "react-router-dom";
import { useLogin } from "../skart_sales/commoncomponents/LoginContextProvider/LoginContextProvider";
import LoadingButtonCommon from "../skart_sales/commoncomponents/LoadingButtonCommon/LoadingButtonCommon";
import Lucide from "../../base-components/Lucide";
import { Lock, LogIn, User } from "lucide-react";
import scooterUrl from "../../assets/images/login/Skart-Banner.png";
import tyreUrl from "../../assets/images/login/tyre.png";
import ekartLineUrl from "../../assets/images/login/ekart-line2.gif";
import "../../assets/css/login.css";

const initialState = {
  buttonname: "Log In",
  resendotp: false,

  showresendbutton: false,
  type: 1,
  userName: "",
  password: "",
  start: false,
  showotpboxes: false,

  otp: ["", "", "", "", "", ""],
};
function Main() {
  const { showAlert } = useAlert();
  const [showPass, setShowPass] = useState<boolean>(false);
  const [verify, setVerify] = useState<boolean>(false);
  const [password, setPassword] = useState("");
  // const [start,setStart]=useState(false)
  const [resendotpisLoading, setResendotpisLoading] = useState<boolean>(false);
  const [timer, setTimer] = useState(120);
  const refs = useRef<any>([]);
  const navigate = useNavigate();
  const [state, setState] = useState(initialState);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [lockedAccount, setLockedAccount] = useState<string>("");
  const { login, userdata } = useLogin();
  // console.log(userdata,"userdata")
  const loginFunc = async () => {
    const loginData: LoginCredential = {
      user_name: userName,
      password: password,
    };
    let response;
    try {
      setIsLoading(true);
      response = await commonpostrequest("auth/login/0", loginData);
      if (response.status == 200) {
        localStorage.setItem(
          "current_user",
          JSON.stringify(response?.data.data),
        );
        login(response?.data.data);
        // console.log(response?.data,"reponse on login")
        showAlert(`Welcome ${response?.data?.data?.display_name}`, "success");

        navigate("/backoffice/dashboard");
      } else if (response.status == 203) {
        showAlert(response.data.message || "Incorrect Password", "error");
      } else if (response.status == 204) {
        showAlert("User Name is not found", "error");
      } else if (response?.response?.status == 412) {
        showAlert(
          response?.response?.data?.message || "You Are Not Active",
          "error",
        );
      } else if (response?.response?.status == 423) {
        setLockedAccount(response?.response?.data?.message || "Your account has been locked for 24 hours due to multiple failed login attempts. You can unlock it immediately using the link sent to your email.");
      } else if (response?.response?.status == 429) {
        const msg429 = response?.response?.data?.message || "";
        if (msg429.toLowerCase().includes("locked")) {
          setLockedAccount(msg429);
        } else {
          showAlert(msg429 || "Too many failed login attempts. Please try again later.", "error");
        }
      } else if (response?.response?.status == 400) {
        showAlert(
          response?.response?.data?.message ||
            "Server Error Please try after some time",
          "error",
        );
      } else if (response.response && response.response.status == 406) {
        showAlert(response.response.data.errors[0].msg, "error");
      } else {
        showAlert("Server Error ! ,Please try after some time", "error");
      }
      // console.log(response);
    } catch (error: any) {
      showAlert(error.message, "error");
      // if(error)
      //   showAlert("something went wrong", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const {
    start,
    resendotp,
    buttonname,
    userName,
    type,
    otp,
    showotpboxes,
    showresendbutton,
  } = state;
  useEffect(() => {
    if (timer == 0) {
      setState((pre) => ({ ...pre, start: false, resendotp: true }));

      setTimer(120);
      // setResendotp(true)
    } else {
      if (type == 2 && start) {
        setState((pre) => ({ ...pre, resendotp: false }));

        const value = setInterval(() => {
          if (timer > 0) {
            setTimer((prevSeconds) => prevSeconds - 1);
          }
        }, 1000);

        return () => clearInterval(value);
      }
    }
  }, [timer, start, buttonname]);

  const minutes = Math.floor(timer / 60);
  const remainingSeconds = timer % 60;

  const handleotprequest = async () => {
    try {
      setIsLoading(true);

      const response: any = await commongetrequest(
        `auth/otp/${userName.trim()}/0`,
      );

      // console.log(response,"deleteresponse")

      if (response?.status == 200) {
        showAlert(response?.data.message, "success");
        setState((pre) => ({
          ...pre,
          showotpboxes: true,
          showresendbutton: true,
        }));

        // setShowResendbutton(true)
        setState((pre: any) => ({
          ...pre,
          buttonname: "Verify OTP",
          start: true,
        }));
        // setStart(true);
      } else if (response?.status == 204) {
        showAlert("No data found!..", "error");
      } else if (response?.status == 203) {
        showAlert(response?.data?.message, "error");
      } else if (response?.message == "Network Error") {
        setError(response?.message);

        showAlert(response?.message, "error");
      } else {
        showAlert("Something going wrong!..", "error");
      }
    } catch (err: any) {
      showAlert(err.message);
    } finally {
      setIsLoading(false);
      setResendotpisLoading(false);
    }
  };
  const handleresendotprequest = async () => {
    setState((pre: any) => ({ ...pre, otp: ["", "", "", "", "", ""] }));
    try {
      setResendotpisLoading(true);

      const response: any = await commongetrequest(`auth/otp/${userName}/6`);

      // console.log(response,"deleteresponse")

      if (response?.status == 200) {
        showAlert(response?.data.message, "success");
        setState((pre) => ({
          ...pre,
          showotpboxes: true,
          showresendbutton: true,
          resendotp: false,
          start: true,
        }));
        setTimer(120);
        // setShowResendbutton(true)
        // setState((pre: any) => ({
        //   ...pre,
        //   buttonname: "Verify OTP",
        //   start: true,
        // }));
        // setStart(true);
      } else if (response?.status == 203) {
        showAlert(response?.data?.message, "error");
      } else if (response?.status == 204) {
        showAlert("No data found!..", "error");
      } else if (response?.message == "Network Error") {
        setError(response?.message);

        showAlert(response?.message, "error");
      } else {
        showAlert("Something going wrong!..", "error");
      }
    } catch (err: any) {
      showAlert(err.message);
    } finally {
      setIsLoading(false);
      setResendotpisLoading(false);
    }
  };

  // post otp request
  const verifyotprequest = async () => {
    try {
      setIsLoading(true);
      setVerify(true);
      const response: any = await commonpostrequest(
        `auth/otp/${userName.trim()}`,
        {
          otp: otp.join(""),
        },
      );

      // console.log(response,"deleteresponse")

      if (response?.status == 200) {
        showAlert(response?.data.message, "success");
        // setOTP(["", "", "", "", "", ""])
        setState((pre: any) => ({
          ...pre,
          otp: ["", "", "", "", "", ""],
          userName: "",
          showotpboxes: false,
          showresendbutton: false,
          buttonname: "Log In",
          type: 1,
          resendotp: true,
          start: false,
        }));

        setTimer(120);
      } else if (response?.status == 203) {
        showAlert(response?.data.message, "error");
      } else if (response?.response.status == 204) {
        showAlert(response?.response.data.message, "error");
      } else if (response?.response.status == 203) {
        showAlert(response?.response.data.message, "error");
      } else if (response?.message == "Network Error") {
        setError(response?.message);

        showAlert(response?.message, "error");
      } else {
        showAlert("Something going wrong!..", "error");
      }
    } catch (err: any) {
      showAlert(err.message, "error");
    } finally {
      setIsLoading(false);
      setVerify(false);
    }
  };

  const handleChange = (index: any, event: any) => {
    const newOTP = [...otp];
    newOTP[index] = event.target.value;
    setState((pre) => ({ ...pre, otp: newOTP }));

    if (event.target.value && index < otp.length - 1) {
      refs.current[index + 1].focus();
    }
  };
  const handleKeyPress = (index: any, event: any) => {
    // Move focus to the previous input box if backspace is pressed in an empty input
    if (event.key === "Backspace" && !otp[index] && index > 0) {
      refs.current[index - 1].focus();
    }
  };
  // console.log(type,"typecoming",buttonname,"btnname",resendotp,"resendotp",otp.length,"otp length",start,"start",timer,"tiemr")
  const checklength = () => {
    const data = otp.filter((item) => {
      if (item) {
        return item;
      }
    });
    // console.log(data,"data")
    return data.length == 6;
  };

  return (
    <>
      <div
        className={
          "lg:flex  block lg:-m-3 lg:-mx-8 relative lg:h-[100%]  lg:overflow-hidden lg:w-auto w-full overflow-hidden"
        }
      >
        <div className="lg:w-[50%] bg-white absolute bottom-[0px] left-[0px] right-[0px] lg:static mx-[-10px] lg:m-0 w-[109%] hidden lg:block ">
          <div
            className="relative before:hidden lg:before:block after:hidden lg:after:block   lg:overflow-hidden bg-primary lg:bg-gradient-to-r lg:from-[#777779] lg:via-[#777779] lg:to-[#fff]  dark:bg-darkmode-800 xl:dark:bg-darkmode-600 
 before:content-[''] before:w-[99%] before:-mt-[28%] before:-mb-[16%] before:-ml-[0] before:absolute before:inset-y-0 before:left-0 before:transform
   before:rotate-[-4.5deg] before:bg-primary/20 before:rounded-[100%] before:dark:bg-darkmode-400 after:content-[''] 
   after:w-[99%] after:-mt-[20%] after:-mb-[13%] after:-ml-[0] after:absolute after:inset-y-0 after:left-0 after:transform after:rotate-[-4.5deg] 
   after:bg-primary after:rounded-[100%] after:dark:bg-darkmode-700  h-[100%] animate-morph transition-all duration-1000 "
          >
            <div className="flex-col min-h-auto lg:min-h-screen md:flex rounded-[431px] ">
              <div className=" m-auto w-full  z-[1]  relative">
                <div className=" justify-end lg:flex  hidden">
                  <div className=" md:pl-[100px] md:pr-[100px] lg:pl-[100px] lg:pr-[100px  xl:pl-[120px] xl:pr-[100px] 2xl:pl-[0px] 2xl:pr-[120px] w-[700px]  ">
                    <a href="" className="flex items-center pt-5 ">
                      <img
                        alt="sKart Logo"
                        className="w-[370px]"
                        src={logoUrl}
                        style={{ filter: "drop-shadow(5px 5px 3px #222)" }}
                      />
                    </a>
                  </div>
                </div>

                <div className="lg:pt-[70px]  xl:pt-[70px]  2xl:pt-[160px]  w-[99%] overflow-hidden z-[1]  scooterBox   lg:rounded-r-[70px] xl:rounded-r-[80px]  2xl:rounded-r-[90px]  3xl:rounded-r-[100px]   ">
                  <div className="scooteranimate ">
                    <div id="homer" className="scale-[.5] lg:transform-none">
                      <img className="scooter" src={scooterUrl} />
                      <i className="tyre wheel">
                        <img src={tyreUrl} />
                      </i>
                      <i className="tyre2 wheel">
                        <img src={tyreUrl} />
                      </i>
                      <i className="ekartline">
                        <img src={ekartLineUrl} />
                      </i>
                    </div>
                  </div>
                </div>

                <div className=" justify-end lg:flex  hidden">
                  <div className=" md:pl-[100px] md:pr-[100px] lg:pl-[100px] lg:pr-[100px  xl:pl-[120px] xl:pr-[100px] 2xl:pl-[0px] 2xl:pr-[120px] w-[700px]  ">
                    <div className="mt-4 text-2xl font-medium leading-tight text-white -intro-x">
                      sKart Global Express Pvt Ltd
                    </div>
                    <div className="mt-7 text-md text-white -intro-x text-opacity-70 dark:text-slate-400 w-[100%] xl:w-[90%] 2xl:w-[70%]">
                      sKart Global Express Pvt Ltd is a next-gen tech-driven
                      express and e-commerce Logistics solution provider.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* END: Login Info */}
        {/* BEGIN: Login Form */}
        <div className="lg:w-[50%] w-full bg-[#777779] lg:bg-[#fff] lg:p-[100px] md:p-[10px] ">
          <div className="lg:hidden block">
            <a
              href=""
              className="flex items-center mt-3 mb-5 text-center justify-center"
            >
              <img
                alt="sKart Logo"
                className="w-[240px]"
                src={logoUrl}
                style={{ filter: "drop-shadow(5px 5px 3px #222)" }}
              />
            </a>
          </div>

          <div className="w-full m-auto md:h-full flex items-center ">
            <div className="w-full lg:w-[460px] bg-white  rounded-[20px] overflow-hidden relative p-[1px]">
              <div className="absolute inset-[-100%] animate-[spin_8s_linear_infinite] hover:[animation-play-state:paused]">
                <div
                  className="h-full w-full
                       bg-[conic-gradient(#d8def0,#f9cd73_4%,#d8def0_20%,#d8def0_95%)]
                       [mask:linear-gradient(#d8def0_0_0)_content-box,linear-gradient(#d8def0_0_0)]
                       [mask-composite:exclude]
                       p-[5px] hover:bg-[conic-gradient(#303030,#303030%,#303030_60%,#303030_95%)]"
                ></div>
              </div>

              <div className="bg-white  rounded-[20px] overflow-hidden relative">
                <div className="w-full bg-[#f7f8fb] border-b border-[#d8def0] rounded-t-[20px] p-[10px] flex items-center justify-center ">
                  {lockedAccount ? (
                    <Lock className="w-[21px] text-[#c0392b]" />
                  ) : (
                    <LogIn className="w-[21px]" />
                  )}
                  <h2 className="text-lg font-bold uppercase text-center text-[#303030] ml-2">
                    {lockedAccount ? "Account Locked" : type == 1 ? "Sign In" : "Forgot Password"}
                  </h2>
                </div>

                {lockedAccount ? (
                  <div className="bg-white rounded-[20px] overflow-hidden relative">
                    <div className="p-[28px] flex flex-col items-center text-center">
                      <div className="w-[72px] h-[72px] rounded-full bg-red-50 flex items-center justify-center mb-4">
                        <Lock className="w-[36px] h-[36px] text-[#c0392b]" />
                      </div>
                      <h3 className="text-[16px] font-bold text-[#c0392b] mb-2">Your account has been temporarily locked</h3>
                      <p className="text-[13px] text-[#555] leading-[1.7] mb-4">{lockedAccount}</p>
                      <div className="w-full bg-amber-50 border border-amber-200 rounded-[10px] p-[12px] mb-5 text-left">
                        <p className="text-[12px] text-amber-800 font-medium mb-1">What to do next:</p>
                        <ul className="text-[12px] text-amber-700 space-y-1 list-disc list-inside">
                          <li>Check your registered email inbox</li>
                          <li>Click the <strong>Unlock My Account</strong> link in the email</li>
                          <li>Your account will auto-unlock after 24 hours</li>
                        </ul>
                      </div>
                      <button
                        onClick={() => { setLockedAccount(""); setPassword(""); setState((pre) => ({ ...pre, userName: "" })); }}
                        className="w-full py-2 px-4 bg-[#303030] text-white rounded-full text-[14px] font-medium hover:bg-[#555] transition-colors"
                      >
                        Back to Login
                      </button>
                    </div>
                  </div>
                ) : (
                <div className="bg-white  rounded-[20px] overflow-hidden relative">
                  <div className=" p-[20px]">
                    <div className="mt-4 intro-x">
                      <div className="mb-3">
                        <FormLabel className="text-[14px] text-primary mb-[2px]">
                          Username
                        </FormLabel>
                        <div className="w-full relative">
                          <i className="absolute top-[7px] left-[0px] z-[50] border-r border-[#eee]  h-[70%] px-[6px] py-[3px] w-[36px] flex items-center justify-center">
                            <User className="text-[#B1B1B1] w-[21px]" />
                          </i>

                          <FormInput
                            type="text"
                            className="block pr-4 pl-[45px] py-3  bg-[#FDFDFD] border-[#EBEBEB] rounded-[10px]"
                            placeholder="Enter username"
                            value={userName}
                            onChange={(e) =>
                              setState((prev) => ({
                                ...prev,
                                userName: e.target.value,
                              }))
                            }
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                e.preventDefault();
                                loginFunc();
                              }
                            }}
                          />
                        </div>{" "}
                      </div>
                      {type == 1 ? (
                        <div className="mb-0">
                          <FormLabel className="text-[14px] text-primary mb-[2px]">
                            Password
                          </FormLabel>

                          <div className="w-full relative">
                            <i className="absolute top-[7px] left-[0px] z-[50] border-r border-[#eee]  h-[70%] px-[6px] py-[3px] w-[36px] flex items-center justify-center">
                              <Lock className="text-[#B1B1B1] w-[18px]" />
                            </i>
                            <InputGroup className="w-full roundedBox">
                              <FormInput
                                type={`${showPass ? "text" : "password"}`}
                                className="block pr-4 pl-[45px] py-3  bg-[#FDFDFD] border-[#EBEBEB] rounded-[20px]"
                                placeholder="Enter password"
                                value={password}
                                onChange={(e) => {
                                  setPassword(e.target.value);
                                  setState((pre: any) => ({
                                    ...pre,
                                    password: e.target.value,
                                  }));
                                }}
                                onKeyDown={(e) => {
                                  if (e.key === "Enter") {
                                    e.preventDefault();
                                    loginFunc();
                                  }
                                }}
                              />
                            </InputGroup>

                            <InputGroup.Text
                              id="input-group-price"
                              className="bg-inherit shadow-none w-[20px] absolute right-[15px] top-[9px] z-[10] border-none  p-0"
                            >
                              <Lucide
                                icon={`${showPass ? "Eye" : "EyeOff"}`}
                                className="text-mustard stroke-2.5 mt-1 h-5 cursor-pointer"
                                onClick={() => setShowPass(!showPass)}
                              />
                            </InputGroup.Text>
                          </div>
                        </div>
                      ) : (
                        <></>
                      )}
                      <div className="flex justify-end mr-auto">
                        {type == 1 && (
                          <div
                            className="mt-2"
                            onClick={() => {
                              setState((pre) => ({
                                ...pre,
                                type: 2,
                                buttonname: "Send OTP",
                              }));
                            }}
                          >
                            <p className="text-mustard cursor-pointer">
                              Forgot Password?
                            </p>
                          </div>
                        )}
                      </div>

                      {type == 2 && start && (
                        <div className="flex justify-center p-2 mt-2 bg-mustard text-white rounded">
                          {" "}
                          <p>
                            RESEND OTP IN:{" "}
                            {minutes < 10 ? `0${minutes}` : minutes}:
                            {remainingSeconds < 10
                              ? `0${remainingSeconds}`
                              : remainingSeconds}
                          </p>
                        </div>
                      )}
                      {type == 2 && showotpboxes ? (
                        <div className="flex justify-center mt-8">
                          <div className="flex space-x-4">
                            {otp.map((digit, index) => (
                              <input
                                key={index}
                                type="text"
                                maxLength={1}
                                value={digit}
                                onChange={(e) => handleChange(index, e)}
                                onKeyDown={(e) => handleKeyPress(index, e)}
                                className="w-10 h-10 shadow-lg  text-center text-primary  border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                                ref={(input) => (refs.current[index] = input)}
                              />
                            ))}
                          </div>
                        </div>
                      ) : (
                        ""
                      )}
                      <div className="mt-4 text-center intro-x xl:text-left">
                        {isLoading ? (
                          <Button className="w-full px-4 py-2 align-top xl:w-full xl:mr-3 mb-2 bg-mustard text-white rounded-full text-lg hover:bg-[#dba948]">
                            {type == 1 && buttonname == "Log In" ? (
                              <LoadingButtonCommon text="Logging" />
                            ) : type == 2 &&
                              buttonname == "Verify OTP" &&
                              verify ? (
                              <LoadingButtonCommon text="Verifying" />
                            ) : type == 2 &&
                              buttonname == "Send OTP" &&
                              !resendotp ? (
                              <LoadingButtonCommon text={"Sending OTP"} />
                            ) : type == 2 &&
                              buttonname == "Send OTP" &&
                              resendotp ? (
                              <LoadingButtonCommon text={"Sending OTP"} />
                            ) : (
                              ""
                            )}
                          </Button>
                        ) : (
                          <Button
                            disabled={
                              type == 2 &&
                              buttonname == "Verify OTP" &&
                              checklength() == true
                                ? false
                                : type == 2 &&
                                    buttonname == "Send OTP" &&
                                    state?.userName
                                  ? false
                                  : type == 1 &&
                                      buttonname == "Log In" &&
                                      state?.userName &&
                                      state?.password
                                    ? false
                                    : true
                            }
                            onClick={() => {
                              type == 1
                                ? loginFunc()
                                : type == 2 && buttonname == "Verify OTP"
                                  ? type == 2 && verifyotprequest()
                                  : buttonname == "Send OTP"
                                    ? type == 2 && handleotprequest()
                                    : "";
                            }}
                            className="w-full px-4 py-2 mb-2 align-top xl:w-full xl:mr-3 bg-mustard text-white rounded-full text-lg hover:bg-[#dba948]"
                          >
                            {type == 1 ? "Log In" : type == 2 ? buttonname : ""}
                          </Button>
                        )}
                        <div>
                          {" "}
                          <div>
                            {type == 2 && showresendbutton && (
                              <>
                                {type == 2 && resendotpisLoading ? (
                                  <Button
                                    disabled={resendotp == false}
                                    // onClick={() => {
                                    //   handleotprequest();

                                    // }}
                                    className="w-full text-white px-4 py-2 align-top xl:w-full xl:mr-3 bg-mustard"
                                  >
                                    <LoadingButtonCommon text="Resending" />
                                  </Button>
                                ) : (
                                  <Button
                                    disabled={resendotp == false}
                                    onClick={() => {
                                      handleresendotprequest();
                                      // setState((pre:any)=>({...pre,buttonname:"Resend Button"}))
                                    }}
                                    className="w-full text-white px-4 py-2 align-top xl:w-full xl:mr-3 bg-mustard"
                                  >
                                    Resend OTP
                                  </Button>
                                )}
                              </>
                            )}
                          </div>
                        </div>
                        {type == 2 ? (
                          <div className="flex justify-end mt-2">
                            {" "}
                            <div
                              onClick={() => {
                                setTimer(120);
                                setState((pre: any) => ({
                                  ...pre,
                                  otp: ["", "", "", "", "", ""],
                                  userName: "",
                                  showotpboxes: false,
                                  showresendbutton: false,
                                  buttonname: "Log In",
                                  type: 1,
                                  start: false,
                                  resendotp: true,
                                }));

                                setTimer(120);
                              }}
                            >
                              <p className="text-mustard cursor-pointer">
                                Go Back
                              </p>
                            </div>
                          </div>
                        ) : (
                          <></>
                        )}
                      </div>
                      <div className="flex text-xs font-medium justify-center text-primary dark:text-slate-200">
                        By signing up, you agree to our Terms and Conditions &
                        Privacy Policy
                      </div>
                    </div>
                  </div>
                </div>
                )}
              </div>
            </div>
          </div>
        </div>
        {/* END: Login Form */}
      </div>
      <div className="md:static absolute bottom-[0px] left-[0px] right-[0px]    w-[109%] block lg:hidden mobilescooter ">
        <div className=" w-full overflow-hidden z-[1]  scooterBox">
          <div className="scooteranimate ">
            <div id="homer" className="scale-[.5] lg:transform-none">
              <img className="scooter" src={scooterUrl} />
              <i className="tyre wheel">
                <img src={tyreUrl} />
              </i>
              <i className="tyre2 wheel">
                <img src={tyreUrl} />
              </i>
              <i className="ekartline">
                <img src={ekartLineUrl} />
              </i>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Main;
