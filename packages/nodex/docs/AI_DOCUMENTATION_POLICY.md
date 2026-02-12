# Política de Documentação para IA (`@ankorar/nodex`)

Este arquivo define o comportamento obrigatório de documentação para alterações feitas com apoio de IA/assistentes de código neste pacote.

## Regras Obrigatórias

1. **Documentação funcional em inglês**
   - Toda documentação nova ou atualizada deste pacote deve ser escrita em inglês.

2. **Documentação faz parte da entrega**
   - Uma funcionalidade não é considerada concluída enquanto a documentação relevante não for atualizada.

3. **Atualize sempre a documentação da API pública quando exports mudarem**
   - Se `src/index.ts` mudar, atualize as seções de API no `README.md` na mesma tarefa.

4. **Documente mudanças de comportamento, não apenas assinaturas**
   - Inclua o que mudou, por que mudou e o impacto para consumidores.

5. **Forneça exemplos de uso para novas capacidades**
   - Novos blocos composáveis/hooks devem incluir ao menos um snippet de uso.

6. **Mantenha nomes e caminhos corretos**
   - A documentação deve referenciar nomes reais de pacote e caminhos reais de arquivo (`@ankorar/nodex`).

7. **Não deixe referências obsoletas**
   - Remova ou corrija referências para APIs/componentes/páginas removidas.

## Checklist Obrigatório de Atualização (para toda PR/tarefa relevante)

- [ ] `README.md` reflete os exports e o uso atual.
- [ ] Comportamentos novos/alterados estão documentados em inglês.
- [ ] Snippets de código compilam conceitualmente com a API atual.
- [ ] APIs removidas não estão mais documentadas.

## Escopo de Commit Sugerido

Use escopos/mensagens focados em documentação quando aplicável, por exemplo:

- `docs(nodex): update composition examples for new hooks`
- `docs(nodex): align API section with index exports`

## Ordem de Prioridade

Quando houver conflito entre velocidade e qualidade da documentação:

1. Correção da documentação
2. Completude da documentação
3. Velocidade de entrega
