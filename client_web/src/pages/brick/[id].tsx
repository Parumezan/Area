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
  const [actions, setActions] = useState<ActionProps[]>([]);
  const [services, setServices] = useState<ServiceProps[]>([]);
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [showCreatePopup, setShowCreatePopup] = useState(false);
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
    if (response.status === 401 || response.status === 403) {
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
        if (response.status === 401 || response.status === 403) {
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
        if (response.status === 401 || response.status === 403) {
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

  async function fetchActions() {
    await fetch(
      `${process.env.NEXT_PUBLIC_BACK_URL}/api/action/brick/${router.query.id}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    )
      .then(async (response) => {
        if (response.status !== 404) {
          const json = await response.json();
          setActions(json);
        }
      })
      .catch(() => {});
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
      .catch(() => {});
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
          <div className="w-full h-full flex flex-col justify-between">
            <div className="w-full h-full grid grid-cols-4 grid-flow-row-dense p-4 gap-4">
              {actions.length &&
                actions.map((action: ActionProps, index: number) => (
                  <Container key={index}>
                    <div className="flex flex-col justify-around space-y-5 w-full max-h-[150px] h-[150px]">
                      <div className="flex flex-col w-full h-full cursor-pointer">
                        <h2 className="text-white truncate">
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
                ))}
            </div>

            <div className="w-full h-full p-4 flex flex-row justify-center">
              <div className="w-1/3">
                <Container>
                  <div
                    className="w-full h-full rounded-lg p-2 cursor-pointer"
                    onClick={() => {
                      setSelectedAction({
                        id: actions.length,
                        serviceName: "Time",
                        description: "",
                        arguments: [],
                        brickId: parseInt(router.query.id[0]),
                        serviceId: -1,
                        actionType: "TIME_IS_X",
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
          {showCreatePopup && (
            <Popup>
              <div className="flex flex-col space-y-8">
                <h2 className="text-white text-center">Create an action</h2>
                <select
                  onChange={(e) => {
                    setSelectedAction({
                      ...selectedAction,
                      serviceName: e.target.value,
                      actionType: servicesMap[e.target.value][0],
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
                  onChange={(e) => {
                    setSelectedAction({
                      ...selectedAction,
                      actionType: e.target.value,
                    });
                  }}
                  className="bg-black text-white rounded-lg p-2"
                >
                  {servicesMap[selectedAction.serviceName].map((key) => (
                    <option key={key} value={key}>
                      {key}
                    </option>
                  ))}
                </select>
                <input
                  placeholder="Argument"
                  type="text"
                  className="bg-black text-white rounded-lg p-2"
                  onChange={(e) =>
                    setSelectedAction({
                      ...selectedAction,
                      arguments: [e.target.value],
                    })
                  }
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
                  onChange={(e) => {
                    setSelectedAction({
                      ...selectedAction,
                      serviceName: e.target.value,
                      actionType: servicesMap[e.target.value][0],
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
                  onChange={(e) => {
                    setSelectedAction({
                      ...selectedAction,
                      actionType: e.target.value,
                    });
                  }}
                  className="bg-black text-white rounded-lg p-2"
                >
                  {servicesMap[selectedAction.serviceName].map((key) => (
                    <option key={key} value={key}>
                      {key}
                    </option>
                  ))}
                </select>
                <input
                  placeholder="Argument"
                  type="text"
                  className="bg-black text-white rounded-lg p-2"
                  onChange={(e) =>
                    setSelectedAction({
                      ...selectedAction,
                      arguments: [e.target.value],
                    })
                  }
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
        </div>
      </DefaultWrapper>
    </div>
  );
}
