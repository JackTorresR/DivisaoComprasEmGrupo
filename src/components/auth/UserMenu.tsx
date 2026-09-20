import { Button } from '../common/Button';

type UserMenuProps = {
  email: string | null;
  onSignOut: () => void;
};

export const UserMenu = (props: UserMenuProps) => {
  const { email, onSignOut } = props;
  return (
    <div className="user-menu">
      {email && <span className="user-menu__email">{email}</span>}
      <Button variant="ghost" size="sm" onClick={onSignOut}>
        Sair
      </Button>
    </div>
  );
};
