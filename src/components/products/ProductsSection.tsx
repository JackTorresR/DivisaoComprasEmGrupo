import { useState } from "react";
import {
  EMPTY_PRODUCT_FILTER,
  filterProducts,
} from "../../domain/calculations/productFilter";
import { useTripData } from "../../hooks/useTripData";
import { useAppStore } from "../../store/useAppStore";
import { pluralize } from "../../utils/plural";
import { Button } from "../common/Button";
import { EmptyState } from "../common/EmptyState";
import { Section } from "../common/Section";
import { ProductFilterBar } from "./ProductFilterBar";
import { ProductForm } from "./ProductForm";
import { ProductItem } from "./ProductItem";

export const ProductsSection = () => {
  const [isAdding, setIsAdding] = useState(false);
  const [formVersion, setFormVersion] = useState(0);
  const { products, bindings, people } = useTripData();
  const [filter, setFilter] = useState(EMPTY_PRODUCT_FILTER);

  const addProduct = useAppStore((state) => state.addProduct);

  const listaProdutos = [...products].sort((a, b) =>
    a.name.localeCompare(b.name, "pt-BR", { sensitivity: "base" }),
  );

  const visibleProducts = filterProducts(listaProdutos, bindings, filter);

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
          <ProductFilterBar
            filter={filter}
            onChange={setFilter}
            totalCount={products.length}
            resultCount={visibleProducts.length}
            onReset={() => setFilter(EMPTY_PRODUCT_FILTER)}
          />
          {visibleProducts.length === 0 ? (
            <EmptyState
              title="Nenhum produto encontrado"
              description="Nenhum produto corresponde à busca ou ao filtro atual."
              action={
                <Button onClick={() => setFilter(EMPTY_PRODUCT_FILTER)}>
                  Limpar filtros
                </Button>
              }
            />
          ) : (
            <div
              role="region"
              className="product-scroll"
              aria-label="Lista de produtos"
            >
              <div className="product-list__head" aria-hidden="true">
                <span>Produto</span>
                <span>Quantidade</span>
                <span>Preço unitário</span>
                <span>Total</span>
                <span />
              </div>
              <ul className="product-list">
                {visibleProducts.map((product) => (
                  <ProductItem
                    people={people}
                    key={product.id}
                    product={product}
                    bindings={bindings}
                  />
                ))}
              </ul>
            </div>
          )}
        </>
      )}
    </Section>
  );
};
