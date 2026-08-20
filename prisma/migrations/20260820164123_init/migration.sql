-- CreateEnum
CREATE TYPE "DiaSemana" AS ENUM ('SEGUNDA', 'TERCA', 'QUARTA', 'QUINTA', 'SEXTA', 'SABADO', 'DOMINGO');

-- CreateEnum
CREATE TYPE "OrigemPedido" AS ENUM ('SITE', 'WHATSAPP', 'BALCAO');

-- CreateEnum
CREATE TYPE "TipoPedido" AS ENUM ('DELIVERY', 'RETIRADA');

-- CreateEnum
CREATE TYPE "FormaPagamento" AS ENUM ('DINHEIRO', 'PIX', 'CREDITO', 'DEBITO');

-- CreateEnum
CREATE TYPE "StatusPedido" AS ENUM ('RECEBIDO', 'EM_PREPARO', 'PRONTO', 'SAIU_PARA_ENTREGA', 'FINALIZADO', 'CANCELADO');

-- CreateEnum
CREATE TYPE "StatusPagamento" AS ENUM ('PENDENTE', 'PAGO');

-- CreateTable
CREATE TABLE "lanchonete" (
    "id" SERIAL NOT NULL,
    "nome" VARCHAR(120) NOT NULL,
    "slug" VARCHAR(100) NOT NULL,
    "logo_url" VARCHAR(500),
    "telefone" VARCHAR(20) NOT NULL,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "aceita_delivery" BOOLEAN NOT NULL DEFAULT true,
    "aceita_retirada" BOOLEAN NOT NULL DEFAULT true,
    "pedido_minimo" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "fuso_horario" VARCHAR(50) NOT NULL,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "lanchonete_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "usuario" (
    "id" SERIAL NOT NULL,
    "lanchonete_id" INTEGER NOT NULL,
    "nome" VARCHAR(120) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "senha_hash" VARCHAR(255) NOT NULL,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "usuario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "horario_funcionamento" (
    "id" SERIAL NOT NULL,
    "lanchonete_id" INTEGER NOT NULL,
    "dia_semana" "DiaSemana" NOT NULL,
    "hora_abertura" TIME(0),
    "hora_fechamento" TIME(0),
    "fechado" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "horario_funcionamento_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "taxa_entrega" (
    "id" SERIAL NOT NULL,
    "lanchonete_id" INTEGER NOT NULL,
    "bairro" VARCHAR(120) NOT NULL,
    "valor" DECIMAL(10,2) NOT NULL,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "taxa_entrega_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cliente" (
    "id" SERIAL NOT NULL,
    "lanchonete_id" INTEGER NOT NULL,
    "nome" VARCHAR(120) NOT NULL,
    "telefone" VARCHAR(20) NOT NULL,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "cliente_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "endereco" (
    "id" SERIAL NOT NULL,
    "cliente_id" INTEGER NOT NULL,
    "taxa_entrega_id" INTEGER,
    "rua" VARCHAR(150) NOT NULL,
    "bairro" VARCHAR(120) NOT NULL,
    "cidade" VARCHAR(120) NOT NULL,
    "numero" VARCHAR(20) NOT NULL,
    "complemento" VARCHAR(150),
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "endereco_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "categoria" (
    "id" SERIAL NOT NULL,
    "lanchonete_id" INTEGER NOT NULL,
    "nome" VARCHAR(120) NOT NULL,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "categoria_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "produto" (
    "id" SERIAL NOT NULL,
    "categoria_id" INTEGER NOT NULL,
    "nome" VARCHAR(150) NOT NULL,
    "preco" DECIMAL(10,2) NOT NULL,
    "descricao" TEXT,
    "foto_url" VARCHAR(500),
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "produto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "adicional" (
    "id" SERIAL NOT NULL,
    "lanchonete_id" INTEGER NOT NULL,
    "nome" VARCHAR(120) NOT NULL,
    "preco" DECIMAL(10,2) NOT NULL,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "adicional_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "produto_adicional" (
    "produto_id" INTEGER NOT NULL,
    "adicional_id" INTEGER NOT NULL,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "produto_adicional_pkey" PRIMARY KEY ("produto_id","adicional_id")
);

-- CreateTable
CREATE TABLE "promocao" (
    "id" SERIAL NOT NULL,
    "produto_id" INTEGER NOT NULL,
    "dia_semana" "DiaSemana" NOT NULL,
    "preco_promocional" DECIMAL(10,2) NOT NULL,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "promocao_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pedido" (
    "id" SERIAL NOT NULL,
    "lanchonete_id" INTEGER NOT NULL,
    "cliente_id" INTEGER,
    "endereco_id" INTEGER,
    "origem" "OrigemPedido" NOT NULL,
    "tipo" "TipoPedido" NOT NULL,
    "forma_pagamento" "FormaPagamento" NOT NULL,
    "status_pedido" "StatusPedido" NOT NULL DEFAULT 'RECEBIDO',
    "status_pagamento" "StatusPagamento" NOT NULL DEFAULT 'PENDENTE',
    "cliente_nome" VARCHAR(120) NOT NULL,
    "cliente_telefone" VARCHAR(20) NOT NULL,
    "endereco_rua" VARCHAR(150),
    "endereco_bairro" VARCHAR(120),
    "endereco_cidade" VARCHAR(120),
    "endereco_numero" VARCHAR(20),
    "endereco_complemento" VARCHAR(150),
    "subtotal" DECIMAL(10,2) NOT NULL,
    "taxa_entrega" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "total" DECIMAL(10,2) NOT NULL,
    "observacao" TEXT,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "pedido_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "item_pedido" (
    "id" SERIAL NOT NULL,
    "pedido_id" INTEGER NOT NULL,
    "produto_id" INTEGER,
    "produto_nome" VARCHAR(150) NOT NULL,
    "quantidade" INTEGER NOT NULL,
    "preco_original" DECIMAL(10,2) NOT NULL,
    "preco_unitario" DECIMAL(10,2) NOT NULL,
    "observacao" TEXT,

    CONSTRAINT "item_pedido_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "item_pedido_adicional" (
    "id" SERIAL NOT NULL,
    "item_pedido_id" INTEGER NOT NULL,
    "adicional_id" INTEGER,
    "nome" VARCHAR(120) NOT NULL,
    "preco_unitario" DECIMAL(10,2) NOT NULL,
    "quantidade" INTEGER NOT NULL,

    CONSTRAINT "item_pedido_adicional_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "lanchonete_slug_key" ON "lanchonete"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "usuario_email_key" ON "usuario"("email");

-- CreateIndex
CREATE INDEX "usuario_lanchonete_id_idx" ON "usuario"("lanchonete_id");

-- CreateIndex
CREATE INDEX "horario_funcionamento_lanchonete_id_dia_semana_idx" ON "horario_funcionamento"("lanchonete_id", "dia_semana");

-- CreateIndex
CREATE INDEX "taxa_entrega_lanchonete_id_idx" ON "taxa_entrega"("lanchonete_id");

-- CreateIndex
CREATE UNIQUE INDEX "taxa_entrega_lanchonete_id_bairro_key" ON "taxa_entrega"("lanchonete_id", "bairro");

-- CreateIndex
CREATE INDEX "cliente_lanchonete_id_idx" ON "cliente"("lanchonete_id");

-- CreateIndex
CREATE UNIQUE INDEX "cliente_lanchonete_id_telefone_key" ON "cliente"("lanchonete_id", "telefone");

-- CreateIndex
CREATE INDEX "endereco_cliente_id_idx" ON "endereco"("cliente_id");

-- CreateIndex
CREATE INDEX "endereco_taxa_entrega_id_idx" ON "endereco"("taxa_entrega_id");

-- CreateIndex
CREATE INDEX "categoria_lanchonete_id_idx" ON "categoria"("lanchonete_id");

-- CreateIndex
CREATE UNIQUE INDEX "categoria_lanchonete_id_nome_key" ON "categoria"("lanchonete_id", "nome");

-- CreateIndex
CREATE INDEX "produto_categoria_id_idx" ON "produto"("categoria_id");

-- CreateIndex
CREATE INDEX "produto_ativo_idx" ON "produto"("ativo");

-- CreateIndex
CREATE INDEX "adicional_lanchonete_id_idx" ON "adicional"("lanchonete_id");

-- CreateIndex
CREATE UNIQUE INDEX "adicional_lanchonete_id_nome_key" ON "adicional"("lanchonete_id", "nome");

-- CreateIndex
CREATE INDEX "produto_adicional_adicional_id_idx" ON "produto_adicional"("adicional_id");

-- CreateIndex
CREATE INDEX "promocao_produto_id_idx" ON "promocao"("produto_id");

-- CreateIndex
CREATE UNIQUE INDEX "promocao_produto_id_dia_semana_key" ON "promocao"("produto_id", "dia_semana");

-- CreateIndex
CREATE INDEX "pedido_lanchonete_id_idx" ON "pedido"("lanchonete_id");

-- CreateIndex
CREATE INDEX "pedido_cliente_id_idx" ON "pedido"("cliente_id");

-- CreateIndex
CREATE INDEX "pedido_endereco_id_idx" ON "pedido"("endereco_id");

-- CreateIndex
CREATE INDEX "pedido_lanchonete_id_status_pedido_idx" ON "pedido"("lanchonete_id", "status_pedido");

-- CreateIndex
CREATE INDEX "pedido_lanchonete_id_created_at_idx" ON "pedido"("lanchonete_id", "created_at");

-- CreateIndex
CREATE INDEX "item_pedido_pedido_id_idx" ON "item_pedido"("pedido_id");

-- CreateIndex
CREATE INDEX "item_pedido_produto_id_idx" ON "item_pedido"("produto_id");

-- CreateIndex
CREATE INDEX "item_pedido_adicional_item_pedido_id_idx" ON "item_pedido_adicional"("item_pedido_id");

-- CreateIndex
CREATE INDEX "item_pedido_adicional_adicional_id_idx" ON "item_pedido_adicional"("adicional_id");

-- AddForeignKey
ALTER TABLE "usuario" ADD CONSTRAINT "usuario_lanchonete_id_fkey" FOREIGN KEY ("lanchonete_id") REFERENCES "lanchonete"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "horario_funcionamento" ADD CONSTRAINT "horario_funcionamento_lanchonete_id_fkey" FOREIGN KEY ("lanchonete_id") REFERENCES "lanchonete"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "taxa_entrega" ADD CONSTRAINT "taxa_entrega_lanchonete_id_fkey" FOREIGN KEY ("lanchonete_id") REFERENCES "lanchonete"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cliente" ADD CONSTRAINT "cliente_lanchonete_id_fkey" FOREIGN KEY ("lanchonete_id") REFERENCES "lanchonete"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "endereco" ADD CONSTRAINT "endereco_cliente_id_fkey" FOREIGN KEY ("cliente_id") REFERENCES "cliente"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "endereco" ADD CONSTRAINT "endereco_taxa_entrega_id_fkey" FOREIGN KEY ("taxa_entrega_id") REFERENCES "taxa_entrega"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "categoria" ADD CONSTRAINT "categoria_lanchonete_id_fkey" FOREIGN KEY ("lanchonete_id") REFERENCES "lanchonete"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "produto" ADD CONSTRAINT "produto_categoria_id_fkey" FOREIGN KEY ("categoria_id") REFERENCES "categoria"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "adicional" ADD CONSTRAINT "adicional_lanchonete_id_fkey" FOREIGN KEY ("lanchonete_id") REFERENCES "lanchonete"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "produto_adicional" ADD CONSTRAINT "produto_adicional_produto_id_fkey" FOREIGN KEY ("produto_id") REFERENCES "produto"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "produto_adicional" ADD CONSTRAINT "produto_adicional_adicional_id_fkey" FOREIGN KEY ("adicional_id") REFERENCES "adicional"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "promocao" ADD CONSTRAINT "promocao_produto_id_fkey" FOREIGN KEY ("produto_id") REFERENCES "produto"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pedido" ADD CONSTRAINT "pedido_lanchonete_id_fkey" FOREIGN KEY ("lanchonete_id") REFERENCES "lanchonete"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pedido" ADD CONSTRAINT "pedido_cliente_id_fkey" FOREIGN KEY ("cliente_id") REFERENCES "cliente"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pedido" ADD CONSTRAINT "pedido_endereco_id_fkey" FOREIGN KEY ("endereco_id") REFERENCES "endereco"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "item_pedido" ADD CONSTRAINT "item_pedido_pedido_id_fkey" FOREIGN KEY ("pedido_id") REFERENCES "pedido"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "item_pedido" ADD CONSTRAINT "item_pedido_produto_id_fkey" FOREIGN KEY ("produto_id") REFERENCES "produto"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "item_pedido_adicional" ADD CONSTRAINT "item_pedido_adicional_item_pedido_id_fkey" FOREIGN KEY ("item_pedido_id") REFERENCES "item_pedido"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "item_pedido_adicional" ADD CONSTRAINT "item_pedido_adicional_adicional_id_fkey" FOREIGN KEY ("adicional_id") REFERENCES "adicional"("id") ON DELETE SET NULL ON UPDATE CASCADE;
