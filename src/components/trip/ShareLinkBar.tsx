import { CopyButton } from "../common/CopyButton";

type ShareLinkBarProps = {
  shareUrl: string;
};

export const ShareLinkBar = (props: ShareLinkBarProps) => {
  const { shareUrl } = props;
  return (
    <div className="share-link-bar">
      <span className="share-link-bar__label">Link para compartilhar:</span>
      <span className="share-link-bar__url">{shareUrl}</span>
      <CopyButton
        label="Copiar link"
        onCopy={() => navigator.clipboard.writeText(shareUrl)}
      />
    </div>
  );
};
