import { KnowledgeDocument } from '../types/knowledge';

export const BUILT_IN_KNOWLEDGE: KnowledgeDocument[] = [
  {
    id: 'builtin-portal-pvi',
    title: 'Portal Oficial da Plataforma Virtual de Instrução (PVI / PMPE)',
    category: 'portal_pvi',
    sourceUrl: 'http://pvi.pm.pe.gov.br/',
    isBuiltIn: true,
    active: true,
    createdAt: 1700000000000,
    summary: 'Estrutura da DEIP, Coordenadoria de Ensino, CEaD, APMP em Paudalho, CEFD, Memorial e Biblioteca.',
    content: `Plataforma Virtual de Instrução (PVI / PMPE) - http://pvi.pm.pe.gov.br/ e https://pvi.pm.pe.gov.br/

1. Definição da PVI:
Plataforma oficial de ensino a distância da Polícia Militar de Pernambuco (PMPE), voltada para a formação, qualificação e instrução continuada da tropa.

2. Diretoria de Ensino, Instrução e Pesquisa (DEIP):
- Órgão de Direção Setorial, subordinada à Diretoria Geral de Administração (DGA).
- Competência: Planejamento, coordenação, fiscalização e controle dos sistemas organizados para as atividades de Ensino, Instrução e Pesquisa da Corporação.
- Histórico: Criada pelo Decreto Estadual nº 365, de 29 de dezembro de 1934; remonta à Lei de Organização Básica (LOB) da PMPE (Lei nº 6.783/1974).

3. Coordenadorias da DEIP:
- Coordenadoria de Ensino (CE): Abrange os cursos de formação básica de ingresso (CFO - Oficiais, CFHP - Praças, CFC - Cabos, CFS - Sargentos) e cursos de aperfeiçoamento (CAS - Sargentos e demais cursos especiais), prestando assessoria ao Diretor de Ensino no planejamento e operacionalização nos Campi.
- Coordenadoria de Ensino a Distância (CEaD - PMPE): Gestão técnica e pedagógica da Plataforma Virtual de Instrução (PVI), estruturação dos ambientes virtuais, acompanhamento dos discentes e emissão dos certificados digitais de capacitação continuada.

4. Campi e Organizações de Ensino subordinadas à DEIP:
- Academia de Polícia Militar do Paudalho (APMP): Instalada no antigo Colégio Vocacional dos Padres do Sagrado Coração de Jesus, na cidade do Paudalho/PE. Abrange uma área de 232 hectares, com aproximadamente 11.000 metros quadrados de área construída. Estabelecimento de Ensino Superior destinado a formar, aperfeiçoar, habilitar, especializar e atualizar Oficiais e Graduados da Polícia Militar, através dos diversos Cursos e Estágios.
- Centro de Educação Física e Desportos (CEFD): Organização Militar subordinada à DEIP, direcionada para a prestação de serviços e incumbências que envolvam atividades físicas. Composta por profissionais formados e técnicos na área de Educação Física, atuando na aplicação dos Testes de Aptidão Física (TAF) do efetivo policial militar e para candidatos em processos seletivos e cursos.

5. Memorial da Educação Corporativa da PMPE:
Acervo digital mantido pela DEIP para preservar e celebrar a trajetória histórica de décadas de dedicação e doutrina de ensino e treinamento da corporação.

6. Biblioteca e Acervo Virtual do PVI (Links úteis disponibilizados):
- Repositório Histórico da Marinha (repositoriodphdm.marinha.mil.br)
- Biblioteca do Exército - BDEx (bdex.eb.mil.br)
- Catálogo Rede BIA da Aeronáutica (catalogo.redebia.fab.mil.br)
- Biblioteca Nacional Digital (bndigital.bn.gov.br)
- Diário Oficial do Estado de Pernambuco - CEPE (diariooficial.cepe.com.br)
- Portal de Legislação da ALEPE (legis.alepe.pe.gov.br)

7. Acesso e Recursos da Plataforma:
- Login institucional: http://pvi.pm.pe.gov.br/login/index.php (acesso individual com matrícula funcional e senha).
- Vídeo Interativo de Acolhimento: "BEM VINDO À PVI! Vídeo Interativo" (/mod/interactivevideo/view.php?id=53).
- Cursos em andamento no domínio: Curso de Procedimentos Operacionais e Legislação Aplicada (ID 105), Atuação Estratégica no Processo Eleitoral (ID 103), entre outros.`,
  },
  {
    id: 'builtin-curso-pvi-105',
    title: 'Curso de Procedimentos Operacionais e Legislação Aplicada (PVI ID 105)',
    category: 'curso_pvi',
    sourceUrl: 'https://pvi.pm.pe.gov.br/course/view.php?id=105',
    isBuiltIn: true,
    active: true,
    createdAt: 1700000000000,
    summary: 'Módulos 1 ao 5: Abordagem, Uso Diferenciado da Força, Inviolabilidade Domiciliar, TCO e Avaliação.',
    content: `Conteúdos dos Módulos do Curso na PVI (https://pvi.pm.pe.gov.br/course/view.php?id=105):

- MÓDULO 1: ABORDAGEM POLICIAL E FUNDADA SUSPEITA
  * Base Legal: Artigos 240, § 2º e 244 do Código de Processo Penal (CPP).
  * Jurisprudência: RHC 158.580/BA do STJ - veda abordagens baseadas em estereótipos subjetivos, exigindo elementos concretos e fundadas razões.
  * Procedimento Operacional Padrão (POP 101): Abordagem a pessoas a pé e veículos; posicionamento de segurança em ângulos de 45° a 90°; atenção permanente à linha da cintura como zona de perigo imediato.
  * Revista Pessoal em Mulheres: Conforme o Artigo 249 do CPP, deve ser realizada por policial feminina, ressalvada a urgência ou risco grave e iminente à vida se não houver policial feminina disponível no momento.

- MÓDULO 2: USO DIFERENCIADO E PROGRESSIVO DA FORÇA E SÚMULA VINCULANTE 11
  * Princípios Doutrinários (Portaria Interministerial 4.226/2010 e Lei Federal 13.060/2014): Legalidade, Necessidade, Proporcionalidade, Moderação e Conveniência.
  * Escala Gradual de Força: Desde a presença policial fardada, verbalização, controle de contato, técnicas de submissão, uso de instrumentos de menor potencial ofensivo (elastômero, espargidores de pimenta, condutor de energia) até o uso extremo de força letal (arma de fogo), restrito à legítima defesa de perigo iminente de morte ou lesão grave.
  * Uso de Algemas e Súmula Vinculante 11 do STF: O uso é excepcional e restrito ao mnemônico PRF:
    1. Perigo à integridade física própria ou alheia;
    2. Resistência à prisão;
    3. Fundado receio de fuga.
  * Dever de Justificação: Sob pena de nulidade da prisão, responsabilidade disciplinar, civil e penal (Art. 21 da Lei nº 13.869/2019 - Abuso de Autoridade), é obrigatória a justificação por escrito no Boletim de Ocorrência (BOPM).

- MÓDULO 3: FLAGRANTE DELITO E INVIOLABILIDADE DOMICILIAR
  * Preceito Constitucional: Artigo 5º, inciso XI da CF/88. A casa é asilo inviolável, ninguém nela podendo penetrar sem consentimento, salvo em flagrante delito, desastre, socorro ou, durante o dia, por determinação judicial.
  * Balizamento dos Tribunais Superiores: STF Tema 280 (RE 603.616) e STJ HC 598.051. A entrada forçada sem mandado exige a presença de justa causa/fundadas razões prévias e objetivas devidamente justificadas a posteriori. O consentimento do morador deve ser comprovado por escrito ou preferencialmente com gravação audiovisual.

- MÓDULO 4: LAVRATURA DO TERMO CIRCUNSTANCIADO DE OCORRÊNCIA (TCO) NA PMPE
  * Marco Legal: Lei Federal nº 9.099/1995 e Decisões Vinculantes do STF nas ADIs 5.637 e 6.245, que reconhecem a plena legitimidade constitucional de policiais militares lavrarem TCO em infrações de menor potencial ofensivo (contravenções e crimes com pena máxima de até 2 anos).
  * Efeitos Práticos: O autor que assumir o compromisso de comparecimento perante o Juizado Especial Criminal não será preso em flagrante nem pagará fiança, sendo a ocorrência registrada via MOP / BOPM eletrônico da PMPE.

- MÓDULO 5: AVALIAÇÃO, APROVEITAMENTO E CERTIFICAÇÃO DA PVI
  * Coordenação Geral: Diretoria de Ensino, Instrução e Pesquisa (DEIP) e Coordenadoria de Ensino a Distância (CEaD - PMPE).
  * Critérios de Conclusão: Participação ativa nos fóruns, realização de questionários avaliativos com exigência de aproveitamento/média mínima de 70% (setenta por cento) e cumprimento do cronograma para emissão de certificação institucional válida para pontuação na carreira militar.`,
  },
  {
    id: 'builtin-legislacao-alepe',
    title: 'Legislação Estadual e Normas Aplicadas da PMPE (Portal ALEPE)',
    category: 'legislacao',
    sourceUrl: 'https://legis.alepe.pe.gov.br/',
    isBuiltIn: true,
    active: true,
    createdAt: 1700000000000,
    summary: 'Estatuto da PMPE (Lei 6.783/74), Código Disciplinar (Lei 11.817/2000), LC 320/2015 e Prazos Investigatórios.',
    content: `Legislação da PMPE no Portal da Assembleia Legislativa de Pernambuco (https://legis.alepe.pe.gov.br/):

1. Lei Estadual nº 6.783, de 16 de outubro de 1974 (Estatuto dos Policiais Militares de Pernambuco):
- Situação Institucional: A PMPE é força auxiliar e reserva do Exército, subordinada ao Governador do Estado, estruturada na hierarquia e na disciplina.
- Círculos Hierárquicos:
  * Oficiais: Coronel PM, Tenente-Coronel PM, Major PM, Capitão PM, 1º Tenente PM e 2º Tenente PM (além de Aspirante a Oficial PM).
  * Praças: Subtenente PM, 1º Sargento PM, 2º Sargento PM, 3º Sargento PM, Cabo PM e Soldado PM (além de Alunos dos cursos de formação).
- Direitos e Deveres: Estabilidade após o cumprimento do estágio probatório, remuneração na forma da lei, assistência médica hospitalar pelo Centro Médico Hospitalar (CMH) e DAS, fardamento regulamentar e porte de arma em razão do cargo.

2. Lei Estadual nº 11.817, de 24 de julho de 2000 (Código Disciplinar dos Militares de Pernambuco - CDMEPE) e Dec. Estadual nº 50.014/2020:
- Classificação das Transgressões Disciplinares: Leves, Médias e Graves (conforme a ofensa aos preceitos morais e institucionais).
- Penas Disciplinares: Advertência, Repreensão, Detenção (até 30 dias), Prisão Disciplinar (até 30 dias), Licenciamento e Exclusão a bem da disciplina.
- Classificação do Comportamento das Praças: Excepcional, Ótimo, Bom, Insuficiente e Mau.
- Competência Disciplinar (Art. 10): Governador do Estado, Secretário de Defesa Social, Comandante-Geral e Comandantes de Organizações Militares (OPMs).

3. Prazos Processuais e Investigatórios na PMPE:
- Sindicância Militar Administrativa: Prazo regulamentar de 30 (trinta) dias, prorrogável por mais até 20 (vinte) dias por despacho fundamentado da autoridade delegante.
- Inquérito Policial Militar (IPM - Art. 20 do CPPM e instruções internas):
  * Se indiciado preso: Prazo improrrogável de 20 (vinte) dias, contados da execução da prisão.
  * Se indiciado solto: Prazo de 40 (quarenta) dias, prorrogável por mais 20 (vinte) dias por determinação da autoridade militar instauradora.

4. Lei Complementar Estadual nº 320, de 23 de dezembro de 2015 e Dec. nº 45.713/2018 (Plano de Cargos e Carreiras):
- Critérios de Promoção: Antiguidade, Merecimento, Bravura e Post-Mortem.
- Requisitos: Cumprimento do interstício mínimo no posto/graduação, comportamento disciplinar regular e aptidão física atestada em TAF aplicado pelo Centro de Educação Física e Desportos (CEFD).

5. Lei Complementar Estadual nº 294, de 15 de janeiro de 2015:
- Regime de remuneração por subsídio fixado em parcela única, com garantia das prerrogativas constitucionais do militar estadual.`,
  },
  {
    id: 'builtin-portal-pmpe',
    title: 'Portal Institucional da PMPE (https://www.pm.pe.gov.br/)',
    category: 'diretriz_pmpe',
    sourceUrl: 'https://www.pm.pe.gov.br/',
    isBuiltIn: true,
    active: true,
    createdAt: 1700000000000,
    summary: 'Diretrizes institucionais, avisos de ensino da DEIP, estrutura corporativa e normas da PMPE.',
    content: `Portal Institucional da Polícia Militar de Pernambuco (https://www.pm.pe.gov.br/):

1. Estrutura e Diretrizes Institucionais:
- Comando Geral da PMPE: Órgão de direção geral com sede no Quartel do Derby, Recife/PE.
- Diretoria de Ensino, Instrução e Pesquisa (DEIP): Responsável pelo planejamento e regulação doutrinária e de ensino de toda a corporação.
- Avisos e Comunicados de Ensino: Publicações de editais de seleção para cursos internos (CFO, CFS, CAS, cursos de especialização), convocações para testes físicos (TAF) e diretrizes de capacitação continuada.

2. Integração com a PVI:
- Todos os cursos oficiais e continuados da PMPE promovidos pela DEIP e CEaD têm suas diretrizes de matrícula e calendário divulgadas nos canais oficiais e integradas à Plataforma Virtual de Instrução (https://pvi.pm.pe.gov.br/).`,
  },
  {
    id: 'builtin-moodle-navegacao',
    title: 'Navegação, Uso do Moodle/PVI e Suporte Técnico',
    category: 'faq',
    sourceUrl: 'https://pvi.pm.pe.gov.br/',
    isBuiltIn: true,
    active: true,
    createdAt: 1700000000000,
    summary: 'Instruções passo a passo de navegação no Moodle/PVI, envio de tarefas, notas, certificados e solução de erros.',
    content: `Navegação e Uso do Ambiente Virtual Moodle na Plataforma Virtual de Instrução (PVI / PMPE):

1. Navegação no Moodle PVI para Alunos / Discentes:
- Acessar Disciplinas: Acesse https://pvi.pm.pe.gov.br/ -> Faça login com matrícula e senha institucional -> No menu superior ou painel lateral esquerdo, clique em "Meus cursos" -> Selecione o curso desejado.
- Envio de Tarefas e Trabalhos:
  Passo 1: Dentro do curso, localize a seção correspondente e clique no título da tarefa.
  Passo 2: Clique no botão "Adicionar envio" (ou "Editar envio").
  Passo 3: Arraste o arquivo (preferencialmente PDF) para a caixa demarcada com a seta azul ou clique no ícone de pasta para selecionar o arquivo no seu dispositivo.
  Passo 4: Clique em "Salvar mudanças". Verifique se o status do envio mudou para "Enviado para avaliação" na cor verde.
- Realização de Questionários e Avaliações:
  Passo 1: Clique sobre o questionário na página do curso.
  Passo 2: Leia atentamente as orientações (tentativas permitidas, tempo limite e método de avaliação) e clique em "Tentar responder o questionário agora".
  Passo 3: Responda as questões por blocos. Ao terminar, clique em "Finalizar tentativa..." -> "Enviar tudo e terminar".
- Acompanhamento de Notas e Prazos:
  No menu lateral ou na barra superior do curso, clique em "Notas" (ou "Livro de Notas") para acompanhar seu aproveitamento em cada módulo. A aprovação exige rendimento mínimo de 70%.
- Emissão de Certificados Digitais:
  Após atingir os requisitos mínimos (média igual ou superior a 70% e conclusão de 100% das atividades obrigatórias), o módulo "Certificado Digital" será desbloqueado. Basta clicar sobre o ícone do certificado e depois no botão "Obter certificado".

2. Resolução Prática de Erros Técnicos no Moodle:
- Erro no Envio de Arquivos: Verifique se o arquivo ultrapassa o limite de tamanho (geralmente 20MB ou 50MB) ou se o formato é aceito (PDF, DOCX, etc.). Prefira salvar como PDF.
- Prazo de Entrega Expirado: Se a data limite tiver passado, o botão "Adicionar envio" fica oculto. Nesse caso, entre em contato imediatamente com o instrutor do módulo ou coordenação da CEaD para solicitar abertura de prazo excepcional.
- Sessão Expirada / Erro de Login: Limpe o cache do navegador ou abra uma janela anônima e faça login novamente em https://pvi.pm.pe.gov.br/login/index.php.

3. Nível Avançado / Gestão de Cursos (Para Instrutores e Administradores):
- Configuração de Blocos: Clique em "Ativar modo de edição" no canto superior direito -> "Adicionar um bloco" (ex: Bloco HTML, Calendário, Barra de Progresso).
- Restrição de Acesso: Nas configurações de uma atividade ou módulo, acesse a seção "Restringir acesso" -> Adicione condições como "Conclusão de atividade prévia", "Nota mínima" ou "Data".
- Relatórios de Conclusão: Acesse a engrenagem do curso -> "Mais..." -> "Relatórios" -> "Conclusão de atividades" para acompanhar a progressão dos policiais matriculados.`,
  },
];
