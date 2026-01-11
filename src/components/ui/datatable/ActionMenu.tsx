"use client";

import {
  MoreHorizontal,
  Trash,
  Settings,
  Copy,
  LucideIcon,
  Eye,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Link from "next/link";
import React, { useState } from "react";
import { useSession } from "@/contexts/SessionContext ";
import { notify } from "@/contexts/ToastProvider";
import { useRouter } from "next/navigation";
import { ApiResponse } from "@/types/generic.types";
import { remoteApiUrl } from "@/config";

interface DropMenu {
  title: string;
  url?: string;
  icon?: LucideIcon;
}

interface ActionMenuProps<TData> {
  row: TData;
  onCopy?: (id: string) => void;
  onDelete?: (access_token: string, id: string) => Promise<ApiResponse<TData>>;
  onClick?: (access_token: string, id: string) => Promise<ApiResponse<any>>;
  onSuccess?: () => void;
  menu?: DropMenu[];
}

export function ActionMenu<TData extends { id: string }>({
  row,
  onCopy,
  onDelete,
  onClick,
  menu = [],
  onSuccess,
}: ActionMenuProps<TData>) {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { session, loading } = useSession();

  const handleDelete = async () => {
    if (!session?.access_token) {
      notify({
        message: "Token has expired.",
        variant: "error",
        timeout: 5000,
      });
      router.push("/auth/signin");
      return;
    }
    setIsLoading(true);
    try {
      const result = (await onDelete?.(session.access_token, row.id)) ?? {
        success: false,
        error: "Unknown error",
      };
      const { success, error } = result;

      if (success)
        notify({
          message: "Record Deleted Successfully",
          variant: "success",
          timeout: 5000,
        });
      if (error)
        notify({
          message: "Record Cound not be Deleted",
          variant: "error",
          timeout: 5000,
        });
      setIsModalOpen(false);
      onSuccess?.();
      router.refresh();
    } catch (error) {
      console.error("Error deleting record:", error);
      notify({
        message: "Failed to delete record.",
        variant: "error",
        timeout: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <DropdownMenu data-loading={loading}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent style={{ position: "relative" }} align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => onCopy?.(row.id)}>
            <Copy />
            Copy ID
          </DropdownMenuItem>

          {menu.map((item, index) => (
            <React.Fragment key={index}>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href={item.url ?? "#"} className="flex items-center">
                  {item.icon ? (
                    <item.icon className="mr-2 h-4 w-4" />
                  ) : (
                    <Settings className="mr-2 h-4 w-4" />
                  )}
                  {item.title}
                </Link>
              </DropdownMenuItem>
            </React.Fragment>
          ))}

          {onDelete && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => setIsModalOpen(true)}
                className="text-red-500"
              >
                <Trash className="mr-2 h-4 w-4" /> Delete
              </DropdownMenuItem>
            </>
          )}

          {onClick && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={async (e) => {
                  e.preventDefault();
                //   if (!session?.access_token) {
                //     notify({
                //       message: "Token has expired.",
                //       variant: "error",
                //       timeout: 5000,
                //     });
                //     router.push("/auth/signin");
                //     return;
                //   }
                  try {
                    const result = await onClick(session.access_token, row.id);
                    if (result?.success?.shouldRedirect) {
                      router.push(`/dashboard/teacher/courses/${row.id}`);
                    }
                  } catch (error) {
                    notify({
                      message: "Failed to view details",
                      variant: "error",
                      timeout: 5000,
                    });
                  }
                }}
                className="cursor-pointer"
              >
                <Eye className="h-4 w-4 mr-2" /> View Details
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Delete Confirmation Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you sure?</DialogTitle>
          </DialogHeader>
          <p>
            This action cannot be undone. This will permanently delete this
            record.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isLoading}
            >
              {isLoading ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
