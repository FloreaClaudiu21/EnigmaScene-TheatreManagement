import { User } from "next-auth";
import { signOut } from "next-auth/react";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { User2 } from "lucide-react";

const DropdownUser = ({ user }: { user: User }) => {
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button
					size="icon"
					variant="outline"
					className="overflow-hidden rounded-full"
				>
					<User2 size={30} />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end">
				<DropdownMenuLabel>Contul Meu</DropdownMenuLabel>
				<DropdownMenuItem className="text-red-500 font-semibold hover:text-red-800">
					{user?.numeClient}
				</DropdownMenuItem>
				<DropdownMenuSeparator />
				<DropdownMenuItem
					onClick={async () => {
						await signOut();
					}}
					className="group hover:cursor-pointer"
				>
					<span className="group-hover:text-red-500">Deconectare</span>
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
};

export default DropdownUser;
