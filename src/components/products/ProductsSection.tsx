import { useState } from "react";
import { useTripData } from "../../hooks/useTripData";
import { useAppStore } from "../../store/useAppStore";
import { pluralize } from "../../utils/plural";
import { Button } from "../common/Button";
import { EmptyState } from "../common/EmptyState";
import { Section } from "../common/Section";
import { ProductForm } from "./ProductForm";
import { ProductItem } from "./ProductItem";

export const ProductsSection = () => {
  const { products, bindings, people } = useTripData();
  const addProduct = useAppStore((state) => state.addProduct);
  const [isAdding, setIsAdding] = useState(false);
  const [formVersion, setFormVersion] = useState(0);

  const listaProdutos = [...products].sort((a, b) =>
    a.name.localeCompare(b.name, "pt-BR", { sensitivity: "base" }),
  );

  return (
    <Section
      step="2"
      title="Produtos"
      description="O que precisa ser comprado, com a quantidade e o preço sugerido de cada unidade."
      actions={
        <>
          <span className="count-pill">
            {pluralize(products.length, "produto", "produtos")}
          </span>
          {!isAdding && (
            <Button variant="primary" onClick={() => setIsAdding(true)}>
              + Adicionar produto
            </Button>
          )}
        </>
      }
    >
      {isAdding && (
        <ProductForm
          key={formVersion}
          cancelLabel="Fechar"
          submitLabel="Adicionar"
          onCancel={() => setIsAdding(false)}
          onSubmit={(draft) => {
            addProduct(draft);
            setFormVersion((version) => version + 1);
          }}
        />
      )}
      {products.length === 0 && !isAdding && (
        <EmptyState
          title="Nenhum produto cadastrado"
          description="Adicione os itens da compra ou carregue o exemplo no topo da página."
        />
      )}
      {products.length > 0 && (
        <>
          <div className="product-list__head" aria-hidden="true">
            <span>Produto</span>
            <span>Quantidade</span>
            <span>Preço unitário</span>
            <span>Total</span>
            <span />
          </div>
          <ul className="product-list">
            {listaProdutos?.map((product) => (
              <ProductItem
                key={product.id}
                product={product}
                bindings={bindings}
                people={people}
              />
            ))}
          </ul>
        </>
      )}
    </Section>
  );
};
