import DefaultWrapper from "@/components/DefaultWrapper";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { PlusCircleIcon } from "@heroicons/react/20/solid";

import { ActionProps, ServiceProps, servicesMap } from "@/types/type";
import Popup from "@/components/Popup";
import Container from "@/components/Container";
import Button from "@/components/Button";

export default function action() {
  const router = useRouter();

  const [services, setServices] = useState<ServiceProps[]>([]);

  const [actions, setActions] = useState<ActionProps[]>([]);
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [showCreatePopup, setShowCreatePopup] = useState(false);
  const [showHelpPopup, setShowHelpPopup] = useState(false);
  const [selectedAction, setSelectedAction] = useState<ActionProps>();

  async function createAction(props: ActionProps) {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACK_URL}/api/action`,
      {
        method: "POST",
        body: JSON.stringify({
          ...props,
        }),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    if (response.status === 401) {
      router.push("/login");
      window.location.reload();
    } else {
      const json = await response.json();
      setActions([...actions, json]);
    }
  }

  function editAction(props: ActionProps) {
    fetch(`${process.env.NEXT_PUBLIC_BACK_URL}/api/action/${props.id}`, {
      method: "PATCH",
      body: JSON.stringify({
        ...props,
      }),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((response) => {
        if (response.status === 401) {
          router.push("/login");
        }
      })
      .then(() => {
        // update the action with the id of action.id
        const idx = actions.findIndex((b) => b.id === props.id);
        setActions([
          ...actions.slice(0, idx),
          props,
          ...actions.slice(idx + 1),
        ]);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function destroyAction(action: ActionProps) {
    fetch(`${process.env.NEXT_PUBLIC_BACK_URL}/api/action/${action.id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((response) => {
        if (response.status === 401) {
          router.push("/login");
          window.location.reload();
        }
      })
      .then(() => {
        // remove the action with the id of action.id
        const idx = actions.findIndex((b) => b.id === action.id);
        setActions([...actions.slice(0, idx), ...actions.slice(idx + 1)]);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  async function fetchServices() {
    await fetch(`${process.env.NEXT_PUBLIC_BACK_URL}/api/service`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then(async (response) => {
        if (response.status !== 404) {
          const json = await response.json();
          setServices(json);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function fetchActions() {
    fetch(
      `${process.env.NEXT_PUBLIC_BACK_URL}/api/action/brick/${router.query.id}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    )
      .then((response) => {
        return response.json();
      })
      .then(async (response) => {
        if (response.status !== 404) {
          setActions(response);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  useEffect(() => {
    if (router.isReady) {
      fetchServices();
      fetchActions();
    }
  }, [router]);

  return (
    <div>
      <DefaultWrapper>
        <div className="w-full h-full flex flex-row">
          <div className="w-1/2 h-full flex flex-col justify-between">
            <div className="flex flex-col space-y-5 w-full h-full p-4">
              <div className="p-2 backdrop-blur-sm bg-opacity-75 bg-gray-800 border border-black rounded-2xl hover:bg-opacity-80">
                <h2 className="text-white text-center">actions</h2>
              </div>
              {actions.map((action: ActionProps, index: number) => {
                if (action.isInput == true) {
                  return (
                    <Container key={index}>
                      <div className="w-full justify-around space-y-5 max-h-[150px]">
                        <div className="flex flex-col w-full h-full cursor-pointer">
                          <h2 className="text-white truncate">
                            {services.forEach((service) => {
                              if (service.id == action.serviceId)
                                action.serviceName = service.title;
                            })}
                            {action.serviceName}
                          </h2>
                          <p className="h-full text-white truncate">
                            {action.description}
                          </p>
                        </div>
                        <div className="flex flex-row space-x-5">
                          <Button
                            onClick={() => {
                              services.forEach((service) => {
                                if (service.id == action.serviceId)
                                  action.serviceName = service.title;
                              });
                              setSelectedAction(action);
                              setShowEditPopup(true);
                            }}
                          >
                            Edit
                          </Button>
                        </div>
                      </div>
                    </Container>
                  );
                }
              })}
            </div>

            <div className="w-full h-full p-4 flex flex-row justify-center">
              <div className="w-full">
                <Container>
                  <div
                    className="w-full h-full rounded-lg p-2 cursor-pointer"
                    onClick={() => {
                      setSelectedAction({
                        id: actions.length,
                        serviceName: services[0].title,
                        description: "",
                        arguments: [],
                        brickId: parseInt(router.query.id as string),
                        serviceId: services[0].id,
                        actionType: Object.keys(
                          servicesMap["action"][services[0].title]
                        )[0],
                        isInput: true,
                      });
                      setShowCreatePopup(true);
                    }}
                  >
                    <PlusCircleIcon className="w-16 h-16 m-auto fill-white" />
                  </div>
                </Container>
              </div>
            </div>
          </div>

          <div className="w-1/2 h-full flex flex-col justify-between">
            <div className="flex flex-col space-y-5 w-full h-full p-4">
              <div className="p-2 backdrop-blur-sm bg-opacity-75 bg-gray-800 border border-black rounded-2xl hover:bg-opacity-80">
                <h2 className="text-white text-center">reactions</h2>
              </div>
              {actions.map((action: ActionProps, index: number) => {
                if (action.isInput == false) {
                  return (
                    <Container key={index}>
                      <div className="w-full justify-around space-y-5 max-h-[150px]">
                        <div className="flex flex-col w-full h-full cursor-pointer">
                          <h2 className="text-white truncate">
                            {services.forEach((service) => {
                              if (service.id == action.serviceId)
                                action.serviceName = service.title;
                            })}
                            {action.serviceName}
                          </h2>
                          <p className="h-full text-white truncate">
                            {action.description}
                          </p>
                        </div>
                        <div className="flex flex-row space-x-5">
                          <Button
                            onClick={() => {
                              services.forEach((service) => {
                                if (service.id == action.serviceId)
                                  action.serviceName = service.title;
                              });
                              setSelectedAction(action);
                              setShowEditPopup(true);
                            }}
                          >
                            Edit
                          </Button>
                        </div>
                      </div>
                    </Container>
                  );
                }
              })}
            </div>

            <div className="w-full h-full p-4 flex flex-row justify-center">
              <div className="w-full">
                <Container>
                  <div
                    className="w-full h-full rounded-lg p-2 cursor-pointer"
                    onClick={() => {
                      setSelectedAction({
                        id: actions.length,
                        serviceName: services[0].title,
                        description: "",
                        arguments: [],
                        brickId: parseInt(router.query.id as string),
                        serviceId: services[0].id,
                        actionType: servicesMap["reaction"][services[0].title]
                          ? Object.keys(
                              servicesMap["reaction"][services[0].title]
                            )[0]
                          : "",
                        isInput: false,
                      });
                      setShowCreatePopup(true);
                    }}
                  >
                    <PlusCircleIcon className="w-16 h-16 m-auto fill-white" />
                  </div>
                </Container>
              </div>
            </div>
          </div>

          {showCreatePopup && (
            <Popup>
              <div className="flex flex-col space-y-8">
                <h2 className="text-white text-center">
                  Create {selectedAction.isInput ? "an action" : "a reaction"}
                </h2>
                <select
                  onChange={(e) => {
                    setSelectedAction({
                      ...selectedAction,
                      serviceName: e.target.value,
                      actionType: Object.keys(
                        servicesMap[
                          selectedAction.isInput ? "action" : "reaction"
                        ][e.target.value]
                      )[0],
                    });
                  }}
                  className="bg-black text-white rounded-lg p-2"
                >
                  {services
                    .filter((key) =>
                      servicesMap[
                        selectedAction.isInput ? "action" : "reaction"
                      ].hasOwnProperty(key.title)
                    )
                    .map((key) => (
                      <option key={key.title} value={key.title}>
                        {key.title}
                      </option>
                    ))}
                </select>
                <select
                  onChange={(e) => {
                    setSelectedAction({
                      ...selectedAction,
                      actionType: e.target.value,
                    });
                  }}
                  className="bg-black text-white rounded-lg p-2"
                >
                  {servicesMap[selectedAction.isInput ? "action" : "reaction"][
                    selectedAction.serviceName
                  ]
                    ? Object.keys(
                        servicesMap[
                          selectedAction.isInput ? "action" : "reaction"
                        ][selectedAction.serviceName]
                      ).map((key) => (
                        <option key={key} value={key}>
                          {key}
                        </option>
                      ))
                    : ""}
                </select>
                <input
                  placeholder="Arguments separated by |"
                  type="text"
                  className="bg-black text-white rounded-lg p-2"
                  onChange={(e) =>
                    setSelectedAction({
                      ...selectedAction,
                      arguments: [e.target.value],
                    })
                  }
                  onMouseOver={() => setShowHelpPopup(true)}
                  onMouseOut={() => setShowHelpPopup(false)}
                />
                <input
                  placeholder="Description"
                  type="text"
                  className="bg-black text-white rounded-lg p-2"
                  onChange={(e) =>
                    setSelectedAction({
                      ...selectedAction,
                      description: e.target.value,
                    })
                  }
                />
                <div className="w-full flex flex-row justify-between">
                  <Button onClick={() => setShowCreatePopup(false)}>
                    Cancel
                  </Button>
                  <Button
                    onClick={() => {
                      services.forEach((service) => {
                        if (service.title == selectedAction.serviceName)
                          selectedAction.serviceId = service.id;
                      });
                      setShowCreatePopup(false);
                      createAction(selectedAction);
                    }}
                  >
                    Create
                  </Button>
                </div>
              </div>
            </Popup>
          )}
          {showEditPopup && (
            <Popup>
              <div className="flex flex-col space-y-8">
                <h2 className="text-white text-center">Edit an action</h2>
                <select
                  value={selectedAction.serviceName}
                  onChange={(e) => {
                    setSelectedAction({
                      ...selectedAction,
                      serviceName: e.target.value,
                      actionType: Object.keys(
                        servicesMap[
                          selectedAction.isInput ? "action" : "reaction"
                        ][e.target.value]
                      )[0],
                    });
                  }}
                  className="bg-black text-white rounded-lg p-2"
                >
                  {services.map((key) => (
                    <option key={key.title} value={key.title}>
                      {key.title}
                    </option>
                  ))}
                </select>
                <select
                  value={selectedAction.actionType}
                  onChange={(e) => {
                    setSelectedAction({
                      ...selectedAction,
                      actionType: e.target.value,
                    });
                  }}
                  className="bg-black text-white rounded-lg p-2"
                >
                  {Object.keys(
                    servicesMap[selectedAction.isInput ? "action" : "reaction"][
                      selectedAction.serviceName
                    ]
                  ).map((key) => (
                    <option key={key} value={key}>
                      {key}
                    </option>
                  ))}
                </select>
                <input
                  value={selectedAction.arguments
                    .map((arg) => arg.replace(/,/g, "|"))
                    .join("|")} //:skull:
                  placeholder="Arguments separated by |"
                  type="text"
                  className="bg-black text-white rounded-lg p-2"
                  onChange={(e) =>
                    setSelectedAction({
                      ...selectedAction,
                      arguments: [e.target.value],
                    })
                  }
                  onMouseOver={() => setShowHelpPopup(true)}
                  onMouseOut={() => setShowHelpPopup(false)}
                />
                <input
                  value={selectedAction.description}
                  placeholder="Description"
                  type="text"
                  className="bg-black text-white rounded-lg p-2"
                  onChange={(e) =>
                    setSelectedAction({
                      ...selectedAction,
                      description: e.target.value,
                    })
                  }
                />
                <div className="w-full flex flex-row justify-between">
                  <Button onClick={() => setShowEditPopup(false)}>
                    Cancel
                  </Button>
                  <Button
                    onClick={() => {
                      destroyAction(selectedAction);
                      setShowEditPopup(false);
                    }}
                  >
                    Destroy
                  </Button>
                  <Button
                    onClick={() => {
                      services.forEach((service) => {
                        if (service.title == selectedAction.serviceName)
                          selectedAction.serviceId = service.id;
                      });
                      editAction(selectedAction);
                      setShowEditPopup(false);
                    }}
                  >
                    Validate
                  </Button>
                </div>
              </div>
            </Popup>
          )}
          {showHelpPopup &&
            servicesMap[selectedAction.isInput ? "action" : "reaction"][
              selectedAction.serviceName
            ] && (
              <div className="absolute left-[62.5%] top-2/4">
                <div className="max-w-[50%] p-4 backdrop-blur-sm bg-opacity-75 bg-gray-800 border border-black rounded-2xl">
                  <h2 className="break-words text-white text-center">
                    {
                      servicesMap[
                        selectedAction.isInput ? "action" : "reaction"
                      ][selectedAction.serviceName][selectedAction.actionType]
                    }
                  </h2>
                </div>
              </div>
            )}
        </div>
      </DefaultWrapper>
    </div>
  );
}
